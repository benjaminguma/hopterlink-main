import { cloneObj } from "../../utils";
import { chatActions } from "../chatState";
import { globalChatState, IChatAction, IChatRouter, IChatRouterState } from "../types";

export const globalChatStateReducer = (state: IChatRouterState, action: IChatAction): IChatRouterState => {
	const oldState = cloneObj(state) as IChatRouterState;
	const newChatState = cloneObj(oldState) as IChatRouterState;
	switch (action.type) {
		case chatActions.BACK: {
			if (newChatState.navigationStack.length === 0) {
				return { ...globalChatState, isOpen: true };
			}
			const state = cloneObj(newChatState.navigationStack.pop() || globalChatState);
			if (!state.isOpen) {
				state.isOpen = true;
			}
			return state;
		}
		case chatActions.CLOSE_CHAT_APP: {
			newChatState.isOpen = false;
			return newChatState;
		}
		case chatActions.OPEN_CHAT_APP: {
			newChatState.isOpen = true;

			newChatState.showThreads = true;
			return newChatState;
		}

		case chatActions.START_CHAT: {
			if (oldState.navigationStack.length) {
				newChatState.navigationStack.push(oldState);
			}
			newChatState.isOpen = true;
			newChatState.actionsStack.push(action);
			return newChatState;
		}
		case chatActions.VIEW_THREAD: {
			newChatState.navigationStack.push(oldState);
			newChatState.isOpen = true;
			newChatState.actionsStack.push(action);

			return newChatState;
		}

		default:
			return newChatState;
	}
};
