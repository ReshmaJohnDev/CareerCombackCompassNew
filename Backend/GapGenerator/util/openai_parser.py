from openai import OpenAI

client = OpenAI()

async def invoke_openai_parsing_api(resume_text: str):
    prompt = f"""Extract the following structured fields from the resume text below. Output in JSON format with these keys:
- reason for the career gap
- duration of the gap
- activities during the gap period 
- skills acquired during the gap
- career_goals
- past_experience (as a list of job objects with company, position, duration, location, description)
- additional_info if any (optional)

Resume:
{resume_text}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=500,
        )

        raw_text = response.choices[0].message.content.strip()

        # Remove any markdown fences if present
        import re
        cleaned_text = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()

        import json
        parsed_result = json.loads(cleaned_text)
        return parsed_result

    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")
