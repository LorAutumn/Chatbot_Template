import { atom } from "jotai";
import { ChatMessage } from "../models/ChatModels";

export const messagesAtom = atom<ChatMessage[]>([
  { sender: "you", message: "Hello there" },
  { sender: "bot", message: "Bonjour le monde" },
]);

export const isBotRespondigAtom = atom<boolean>(false);
