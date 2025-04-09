import { IThread } from "../../types";
import { chatActions } from "../chatState";

export type IStartChatPayload = {
	type: (typeof chatActions)["START_CHAT"];
	payload: {
		thread: IThread;
	};
};

export type IChatAction =
	| IStartChatPayload
	| {
			type:
				| (typeof chatActions)["CLOSE_CHAT_APP"]
				| (typeof chatActions)["BACK"]
				| (typeof chatActions)["OPEN_CHAT_APP"];
	  }
	| {
			type: (typeof chatActions)["VIEW_THREAD"];
			payload: {
				id: string;
			};
	  };

export type IChatRouterState = {
	isOpen: boolean;
	navigationStack: IChatRouterState[];
	showThreads: boolean;
	actionsStack: IChatAction[];
};

export const globalChatState: IChatRouterState = {
	isOpen: false,
	navigationStack: [],
	showThreads: false,
	actionsStack: [],
};

export interface IChatRouter {
	back(): void;
	push(action: IChatAction): void;
	startChat(payload: IStartChatPayload["payload"]): void;
	closeChat(): void;
	openChat(): void;
	globalState: IChatRouterState;
}
