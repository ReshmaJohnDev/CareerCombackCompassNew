from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..util.chatbot import ask_chatbot

router = APIRouter(
    prefix="/chat",
    tags=["Chatbot"],
)

class ChatRequest(BaseModel):
    message: str
    context: str | None = None  # Optional background or initial message

@router.post("/ask")
def chat_with_bot(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    response = ask_chatbot(request.message, request.context)
    return {"response": response}
