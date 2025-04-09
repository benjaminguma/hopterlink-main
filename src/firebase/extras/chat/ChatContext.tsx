import { createContext, useContext } from "react";
import { IChatContext, IMessage, IThread, IThreadContext } from "../types";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { DocumentData, QuerySnapshot, Timestamp } from "firebase/firestore";
import { chatFactories } from "../utils";

export const ChatContext = createContext<{
	sendMessage: () => Promise<void>;
	messages: IMessage[];
	loadingThread: boolean;
	thread: IThread | null;
	handleThreadViewed: () => Promise<void>;
	viewerEmail: string;
	textInput: string;
	setTextInput: React.Dispatch<React.SetStateAction<string>>;
}>({
	async sendMessage() {},
	messages: [],
	loadingThread: false,
	async handleThreadViewed() {},
	thread: null,
	viewerEmail: "",
	textInput: "",
	setTextInput: () => {},
});

export function useChat() {
	return useContext(ChatContext);
}
