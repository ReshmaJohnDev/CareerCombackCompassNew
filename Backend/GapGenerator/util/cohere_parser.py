import httpx
import os
import json
import re
import traceback
from fastapi import HTTPException
from cohere import ClientV2 

cohere_api_key = os.getenv("COHERE_API_KEY")
co = ClientV2(cohere_api_key)  #



def safe_json_loads(raw_text: str):
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError as e:
        print(f"Initial JSON decode failed: {e}")

        # Attempt a basic fix for unclosed objects/arrays
        repaired_text = raw_text.rstrip(", \n")

        # Close unclosed "past_experience" lists (custom heuristic)
        if '"past_experience": [' in repaired_text and not repaired_text.endswith("]}"):
            repaired_text += "]}"

        # Ensure the entire object is closed
        if not repaired_text.endswith("}"):
            repaired_text += "}"

        try:
            return json.loads(repaired_text)
        except json.JSONDecodeError as e2:
            raise HTTPException(
                status_code=500,
                detail=f"JSON decode error after repair attempt: {e2}\nRaw or repaired text:\n{repr(repaired_text)}"
            )

import re

def clean_gap_summary(text: str) -> str:
    if not text:
        return ""
    
    # 1. Remove markdown bold (**text**) and italics (*text*)
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)

    # 2. Replace multiple newlines with a single newline
    text = re.sub(r"\n\s*\n", "\n\n", text)

    # 3. Replace multiple spaces with a single space
    text = re.sub(r"[ \t]+", " ", text)

    # 4. Strip leading/trailing whitespace
    text = text.strip()

    return text


async def invoke_cohere_gap_summary(text: str) -> str:
    if not text.strip():
        raise ValueError("No text to summarize")
    try:
        messages = [
            {"role": "system", "content": "You are an assistant that creates concise gap stories."},
            {"role": "user", "content": text}
        ]
        response = co.chat(
            model="command-xlarge-nightly",
            messages=messages,
            temperature=0.3
        )
        content = response.message.content

        if isinstance(content, list):
            gap_summary = " ".join(str(item) for item in content)
        else:
            gap_summary = str(content)
        
        # Remove unwanted wrapper like "type='text' text='…'"
        if gap_summary.startswith("type='text' text="):
            gap_summary = re.sub(r"^type='text' text='(.*)'$", r"\1", gap_summary)

        gap_summary = clean_gap_summary(gap_summary)
        return gap_summary
 
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Cohere API error: {str(e)}")
    

async def invoke_cohere_parsing_api(resume_text: str) -> str:
    """
    Generate a concise career gap summary from resume text using Cohere Chat API.
    Returns plain text.
    """
    if not cohere_api_key:
        raise HTTPException(status_code=500, detail="Missing Cohere API key")

    try:
        # System + user prompt
        messages = [
            {
                "role": "system",
                "content": "You are an assistant that writes a **positive, first-person career gap story**. "
                    "Write as if the candidate is describing their own gap story. "
                    "Focus on growth, skills acquired, projects, and professional development. "
                    "Do not include the candidate's name. Keep it concise and professional."
            },
            {
                "role": "user",
                "content": f"Here is my resume text:\n\n{resume_text}\n\n"
                           "Generate a short, positive career gap story in the first person."
            
            }
        ]

        # Call Cohere chat
        response = co.chat(
            model="command-xlarge-nightly",
            messages=messages,
            temperature=0.3
        )

        # Extract text content from response
        content_blocks = response.message.content
        if isinstance(content_blocks, list):
            raw_text = " ".join(
                getattr(block, "text", "") for block in content_blocks if getattr(block, "text", None)
            )
        else:
            raw_text = getattr(content_blocks, "text", str(content_blocks))

        # Clean and return
        gap_summary = clean_gap_summary(raw_text)
        return gap_summary

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Cohere API error: {str(e)}")
