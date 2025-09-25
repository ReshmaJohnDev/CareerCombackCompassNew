import cohere
import os

co = cohere.Client(os.getenv("COHERE_API_KEY"))  # Load API key

def ask_chatbot(message: str, context: str = "") -> str:
    try:
        response = co.chat(
            message=message,
            preamble=(
        "You are a warm, supportive career comeback coach. "
        "Keep your replies short (2-4 sentences), positive, and chat-like. "
        "Only go deeper if the user asks for more detail."
    ),
            temperature=0.6,
            chat_history=[{"role": "USER", "message": context}] if context else None,
            max_tokens=120
        )
        return response.text
    except Exception as e:
        return f"Sorry, something went wrong: {str(e)}"
