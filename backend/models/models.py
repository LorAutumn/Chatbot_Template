from pydantic import BaseModel, validator

class ChatResponse(BaseModel):
    sender: str
    message: str
    type: str

    @validator("sender")
    def sender_must_be_bot_our_you(cls, v):
        if v not in ["bot", "you"]:
            raise ValueError("Sender must be bot or you")
        return v
    
    @validator("type")
    def validate_message_type(cls, v):
        if v not in ["start", "stream", "end"]:
            raise ValueError("type must be stream or end")
        return v