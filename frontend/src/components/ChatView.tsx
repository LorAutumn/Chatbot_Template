import { isBotRespondigAtom, messagesAtom } from "../state/atoms";
import { useAtom } from "jotai";
import ChatBubble from "./ChatBubble";
import useWebSocket from "react-use-websocket";
import { ChatMessage, ChatResponse } from "../models/ChatModels";
import { useEffect, useRef } from "react";

const WS_URL = import.meta.env.VITE_WS_URL;

const ChatView = () => {
  const [messages, setMessages] = useAtom(messagesAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsBotResponding] = useAtom(isBotRespondigAtom);

  const { lastJsonMessage } = useWebSocket<string>(WS_URL, {
    share: true,
  });

  const responseMessage: ChatResponse = JSON.parse(lastJsonMessage);
  const acutalMessage: ChatMessage = { sender: "bot", message: "" };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => elementRef.current?.scrollIntoView());
    return <div ref={elementRef} />;
  };

  useEffect(() => {
    if (lastJsonMessage) {
      const messageType = responseMessage.type;

      if (messageType === "start") {
        setIsBotResponding(true);
        return;
      }

      if (messageType === "stream") {
        if (responseMessage.message.endsWith('"')) {
          responseMessage.message = responseMessage.message.slice(0, -1);
        }
        acutalMessage.message = acutalMessage.message.concat(
          responseMessage.message
        );

        acutalMessage.message !== "" && messages.at(-1)?.sender !== "you"
          ? setMessages((messages) => [...messages.slice(0, -1), acutalMessage])
          : setMessages((messages) => [...messages, acutalMessage]);
      }

      if (messageType === "end") {
        acutalMessage.message = "";
        setIsBotResponding(false);
      }
    }
  }, [lastJsonMessage]);

  return (
    messages.length > 0 && (
      <>
        {messages.map((message, index) => (
          <ChatBubble message={message} index={index} />
        ))}
        <AlwaysScrollToBottom />
      </>
    )
  );
};

export default ChatView;
