import "./App.css";
import ChatInput from "./components/ChatInput";
import ChatView from "./components/ChatView";
import useWebSocket from "react-use-websocket";

const WS_URL: string = import.meta.env.VITE_WS_URL;

function App() {
  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("Connection opened")
    },
  });

  return (
    <>
      <div className="h-[90vh] max-h-[1000px] min-w-[500px] max-w-[800px] mx-auto flex flex-col justify-between border-2 rounded-md p-2">
        <div className="h-[80vh] overflow-y-auto border-b-2">
          <ChatView />
        </div>
        <ChatInput />
      </div>
    </>
  );
}

export default App;
