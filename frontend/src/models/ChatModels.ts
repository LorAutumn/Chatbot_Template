export interface ChatMessage {
  sender: "you" | "bot";
  message: string;
}

export interface ChatResponse {
  sender: "you" | "bot";
  message: string;
  type: "start" | "stream" | "end";
}
