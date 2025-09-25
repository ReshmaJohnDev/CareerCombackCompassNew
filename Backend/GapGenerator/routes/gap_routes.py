from fastapi import APIRouter, File, UploadFile, HTTPException,Form
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
from docx import Document
import uuid
import os
import traceback
from ..util.cohere_parser import invoke_cohere_parsing_api, invoke_cohere_gap_summary

router = APIRouter(
    prefix="/gap",
    tags=["Gap Generator"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def extract_text_from_pdf(filepath):
    doc = fitz.open(filepath)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def extract_text_from_docx(filepath):
    doc = Document(filepath)
    return "\n".join([para.text for para in doc.paragraphs])



@router.post("/generate_gap_story")
async def generate_gap_story_endpoint(text: str = Form(...)):
    if not text:
        raise HTTPException(status_code=400, detail="Text input is required")

    summary = await invoke_cohere_gap_summary(text)
    return {"parsed_data": summary}


@router.post("/upload_and_parse_resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    filename = file.filename
    ext = filename.lower().split(".")[-1]

    if ext not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Only .pdf and .docx allowed."
        )

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    try:
        with open(filepath, "wb") as f:
            f.write(file.file.read())

        if ext == "pdf":
            extracted_text = extract_text_from_pdf(filepath)
        else:
            extracted_text = extract_text_from_docx(filepath)

        summary = await invoke_cohere_parsing_api(extracted_text)
        return {"parsed_data": summary}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process resume: {str(e)}"
        )

    finally:
        if os.path.exists(filepath):
            os.remove(filepath)
