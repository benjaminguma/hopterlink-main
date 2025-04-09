"use client";
import React, { PropsWithChildren, useReducer } from "react";
import { CheapChatRouterContext } from "./cheapChatContext";
import ThreadProvider from "../../threads/context/ThreadProvider";
import { globalChatState as gcs, IChatAction, IStartChatPayload } from "../types";
import { globalChatStateReducer } from "../reducer/ChatNavigationReducer";
import { chatActions } from "../chatState";
import FirebaseAuthProvider from "@/firebase/auth/context/AuthProvider";

function CheapChatProvider(props: PropsWithChildren) {
	const [globalChatState, dispatch] = useReducer(globalChatStateReducer, gcs);
	function back() {
		dispatch({
			type: chatActions.BACK,
		});
	}
	function push(action: IChatAction) {
		dispatch(action);
	}
	function startChat(payload: IStartChatPayload["payload"]) {
		dispatch({
			type: chatActions.START_CHAT,
			payload,
		});
	}
	function closeChat() {
		dispatch({
			type: chatActions.CLOSE_CHAT_APP,
		});
	}

	function openChat() {
		dispatch({
			type: chatActions.OPEN_CHAT_APP,
		});
	}

	return (
		<CheapChatRouterContext.Provider
			value={{
				globalState: globalChatState,
				back,
				push,
				startChat,
				closeChat,
				openChat,
			}}
		>
			<FirebaseAuthProvider>
				<ThreadProvider>{props.children}</ThreadProvider>
			</FirebaseAuthProvider>
		</CheapChatRouterContext.Provider>
	);
}

export default CheapChatProvider;
