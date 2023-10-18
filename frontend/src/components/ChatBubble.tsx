import { ChatMessage } from "../models/ChatModels";

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const bubbleStyle = (sender: ChatMessage["sender"]) => {
    return sender === "bot"
      ? "chat-bubble chat-bubble-neutral whitespace-pre-wrap"
      : "chat-bubble chat-bubble-secondary whitespace-pre-wrap";
  };

  // formatting needed as backend sends \\n instead of \n
  const formatedMessage = message.message.replace(/\\n/g, "\n");

  return (
    <div
      className={message.sender === "bot" ? "chat chat-start" : "chat chat-end"}
    >
      <div className="chat-footer">{message.sender}</div>
      <div className={bubbleStyle(message.sender)}>{formatedMessage}</div>
    </div>
  );
};

export default ChatBubble;
