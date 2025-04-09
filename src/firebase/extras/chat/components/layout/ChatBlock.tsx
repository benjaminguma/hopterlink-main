"use client";
import { AuthStatus, useAuth } from "@/firebase/auth/context/AuthContext";
import React from "react";
import { useChatRouter } from "../../navigation/cheapChatContext";
import ThreadMessages, { ChatSheet } from "../chat-support";
import { ExpandableChat } from "../ui/chat/expandable-chat";
import ChatProvider from "../../ChatProvider";
import ChatThreads from "../chat-threads";
import { useCategories } from "@/contexts/ReUsableData";

interface ErrorBoundryProps {
	fallbackUI?: JSX.Element;
	message: string;
}

export class ErrorBoundary extends React.Component<PropsWithChildren<ErrorBoundryProps>, { hasError: boolean }> {
	constructor(props: ErrorBoundryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: any) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: any, info: any) {
		console.log(error, "fed to analytics");
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return this.props.fallbackUI ? (
				this.props.fallbackUI
			) : (
				<div className='p-1 center-flex bg-g-l bord-g-1'>failed</div>
			);
		}

		return this.props.children;
	}
}

function ChatBlock() {
	const { authStatus } = useAuth();
	const { userInfo } = useCategories();

	if (authStatus !== AuthStatus.AUTHENTICATED && !userInfo) {
		return null;
	}
	return <ChatStack />;
}

export default ChatBlock;

function ChatStack() {
	const { globalState, back, startChat, closeChat, openChat } = useChatRouter();

	const { isOpen, navigationStack, actionsStack } = globalState;

	const lastAction = globalState.actionsStack[globalState.actionsStack.length - 1];
	return (
		<ExpandableChat
			key={"_"}
			isOpen={globalState.isOpen}
			close={closeChat}
			open={openChat}
			size='md'
			position='bottom-right'
		>
			{(!lastAction ||
				(lastAction && lastAction?.type === "OPEN_CHAT_APP") ||
				lastAction?.type === "BACK") && <ChatThreads key={"|"} />}

			{lastAction?.type === "START_CHAT" && (
				<ErrorBoundary>
					<ChatProvider key={"_"} threadId='' initialThreadData={lastAction.payload.thread}>
						<ChatSheet key={"||"} />
					</ChatProvider>
				</ErrorBoundary>
			)}
			{lastAction?.type === "VIEW_THREAD" && (
				<ChatProvider key={"+"} threadId={lastAction.payload.id} initialThreadData={null}>
					<ChatSheet key={"|||"} />
				</ChatProvider>
			)}
		</ExpandableChat>
	);
}
