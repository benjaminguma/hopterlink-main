import { createContext, useContext } from "react";
import { globalChatState, IChatAction, IChatRouter, IStartChatPayload } from "../types";

export const CheapChatRouterContext = createContext<IChatRouter>({
	back() {},
	push(action: IChatAction) {},
	startChat(payload: IStartChatPayload["payload"]) {},
	closeChat() {},
	globalState: globalChatState,
	openChat() {},
});

export const useChatRouter = () => useContext(CheapChatRouterContext);
