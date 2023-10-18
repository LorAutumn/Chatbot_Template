import asyncio
import os
from fastapi import FastAPI, WebSocket
import dotenv

from langchain.agents import initialize_agent, AgentType
from langchain.callbacks.streaming_aiter_final_only import AsyncFinalIteratorCallbackHandler
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.tools import Tool
from pydantic import BaseModel
from models.models import ChatResponse
from asyncio import create_task

app = FastAPI()

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
dotenv.load_dotenv(dotenv_path)
apikey = os.getenv('OPEN_AI_API_KEY')

async def stream_response(userInput, websocket: WebSocket):
    ## You can modify the agent here
    #######################################
    callback_handler = AsyncFinalIteratorCallbackHandler(answer_prefix_tokens=["Final", "Answer", '",', "", '"', "action", "_input", '":', '"',])
    llm = ChatOpenAI(openai_api_key=apikey, temperature=0, streaming=True, callbacks=[callback_handler])
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    agent = initialize_agent(tools=[], llm=llm, agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION, verbose=True, memory=memory, handle_parsing_errors=True)
    #######################################
    
    # Clearing the done flag of callback_handler
    callback_handler.done.clear()
    
    create_task(agent.arun(input=userInput))
    
    # Sending a start message to the client
    await websocket.send_json(ChatResponse(sender="bot", message="", type="start").json())

    response: str = ""
    
    # Streaming the response to the client
    async for token in callback_handler.aiter():
        if token == "}":
            ## remove trailing " from last token of bot answer
            await websocket.send_json(ChatResponse(sender="bot", message=response[:-1], type="stream").json()) 

            await websocket.send_json(ChatResponse(sender="bot", message="", type="end").json())
            break
        
        response += token

        if response != "":
            await websocket.send_json(ChatResponse(sender="bot", message=response, type="stream").json())
    
    # Setting the done flag of callback_handler
    callback_handler.done.set()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    async for userInput in websocket.iter_text():
        await asyncio.gather(stream_response(userInput, websocket))

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=9000)