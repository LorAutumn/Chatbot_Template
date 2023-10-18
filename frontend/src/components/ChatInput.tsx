import { useState } from "react";
import { ChatMessage } from "../models/ChatModels";
import { useAtom } from "jotai";
import { messagesAtom, isBotRespondigAtom } from "../state/atoms";
import useWebSocket from "react-use-websocket";

const WS_URL: string = import.meta.env.VITE_WS_URL;

const ChatInput = () => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isBotResponding, setIsBotResponding] = useAtom(isBotRespondigAtom);

  const { sendMessage } = useWebSocket(WS_URL, {
    share: true,
  });

  const handleKeyPress = (event: React.KeyboardEvent) =>
    event.key === "Enter" && submitMessage();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setMessageInputValue(event.target.value);

  const submitMessage = () => {
    if (messageInputValue === "") {
      return;
    }

    const message: ChatMessage = { sender: "you", message: messageInputValue };

    sendMessage(messageInputValue);
    setMessages(() => [...messages, message]);
    setMessageInputValue("");
    setIsBotResponding(true);
  };

  return (
    <div className="inline-flex">
      <input
        type="text"
        className="input input-bordered w-[90vw] mr-2 mt-2 disabled:bg-gray-100"
        value={isBotResponding ? "Berater Antwortet..." : messageInputValue}
        onChange={handleOnChange}
        onKeyDown={handleKeyPress}
        disabled={isBotResponding}
      />
      <button
        className="btn btn-primary w-[5vw] mt-2 "
        disabled={isBotResponding}
        onClick={() => submitMessage()}
      >
        {isBotResponding ? (
          <span className="loading loading-dots"></span>
        ) : (
          "Send"
        )}
      </button>
    </div>
  );
};

export default ChatInput;
