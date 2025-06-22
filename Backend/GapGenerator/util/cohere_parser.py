import httpx
import os
import json
import re
import traceback
from fastapi import HTTPException


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


async def invoke_cohere_parsing_api(resume_text: str):
    cohere_api_key = os.getenv("COHERE_API_KEY")
    if not cohere_api_key:
        raise HTTPException(status_code=500, detail="Missing Cohere API key")

    headers = {
        "Authorization": f"Bearer {cohere_api_key}",
        "Content-Type": "application/json"
    }

    prompt = f"""Extract the following structured fields from the resume text below. Output STRICTLY VALID and COMPLETE JSON ONLY with these keys, enclosed within triple backticks:

- reason_for_career_gap: Briefly explain the reason for any career gap.
- duration_of_gap: Length of the career gap.
- activities_during_gap: Key activities, learning, or projects during the gap.
- skills_acquired: Relevant skills gained during the gap period.
- career_goals: Your professional goals moving forward.
- past_experience: Summarize relevant past experience that supports your career goals, focusing on key roles and achievements.
- additional_info: Any other relevant information.

Resume:
{resume_text}

Output the JSON enclosed in triple backticks like this:

```json
{{
  ...
}}
"""
    payload = {
        "model": "command-r-plus",
        "prompt": prompt,
        "temperature": 0.3,
        "max_tokens": 700
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                "https://api.cohere.ai/v1/generate",
                headers=headers,
                json=payload
            )
            response.raise_for_status()

            data = response.json()
            if "generations" not in data or not data["generations"]:
                raise Exception("Invalid response from Cohere API: missing generations")

            raw_text = data["generations"][0].get("text", "").strip()

            # Extract JSON inside triple backticks (with json)
            match = re.search(r"```json\s*(\{.*?\})\s*```", raw_text, re.DOTALL)
            if not match:
                raise Exception("JSON output not found or improperly formatted")

            json_text = match.group(1)

            parsed_result = safe_json_loads(json_text)

            return parsed_result

        except httpx.RequestError as req_err:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Request to Cohere failed: {str(req_err)}")
        except httpx.HTTPStatusError as status_err:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Cohere API error: {str(status_err)}")
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Unexpected error from Cohere API: {str(e)}")