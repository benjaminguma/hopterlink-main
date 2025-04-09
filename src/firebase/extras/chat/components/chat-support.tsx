"use client";

import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import {
	ExpandableChat,
	ExpandableChatHeader,
	ExpandableChatBody,
	ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useChat } from "../ChatContext";
import { useChatRouter } from "../navigation/cheapChatContext";
import { resolveChatInfo } from "../../utils";
import { useThreads } from "../../threads/context/ThreadContext";

export default function ThreadMessages() {
	const { messages, textInput, setTextInput, loadingThread, sendMessage, thread, handleThreadViewed } = useChat();
	const { viewerId } = useThreads();
	const chatInfo = resolveChatInfo(thread, atob(viewerId));
	const { back } = useChatRouter();
	const messagesRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>): void {
		setTextInput(event.target.value);
	}

	useEffect(() => {
		handleThreadViewed();
	}, []);

	return (
		<>
			<ExpandableChatHeader className='bg-muted/60'>
				<div className='flex gap-5  items-center'>
					<Button onClick={() => back()} variant={"outline"}>
						back
					</Button>
					<div>
						<h1 className='text-xl font-semibold'>{chatInfo.recipients[0]?.fullName} ✨</h1>
						<p>{chatInfo.recipients[0]?.externalId}</p>
					</div>
				</div>
			</ExpandableChatHeader>
			<ExpandableChatBody>
				<ChatMessageList className='bg-muted/25' ref={messagesRef}>
					{/* Messages */}
					{messages &&
						messages.map((message, index) => (
							<ChatBubble
								key={index}
								variant={message.senderEmail === viewerId ? "sent" : "received"}
							>
								<ChatBubbleAvatar
									src=''
									fallback={message.senderEmail === viewerId ? "👨🏽" : "🤖"}
								/>
								<ChatBubbleMessage
									variant={message.senderEmail === viewerId ? "sent" : "received"}
								>
									{message.text}
								</ChatBubbleMessage>
							</ChatBubble>
						))}

					{/* Loading */}
					{/* {isGenerating && (
						<ChatBubble variant='received'>
							<ChatBubbleAvatar src='' fallback='🤖' />
							<ChatBubbleMessage isLoading />
						</ChatBubble>
					)} */}
				</ChatMessageList>
			</ExpandableChatBody>
			<ExpandableChatFooter className='bg-muted/25'>
				<form ref={formRef} className='flex relative gap-2' onSubmit={onSubmit}>
					<ChatInput
						value={textInput}
						onChange={handleInputChange}
						onKeyDown={onKeyDown}
						className='min-h-12 bg-background shadow-none '
					/>
					<Button
						className='absolute top-1/2 right-2 transform  -translate-y-1/2'
						type='submit'
						size='icon'
						disabled={!textInput.trim().length}
						onClick={() => sendMessage()}
					>
						<Send className='size-4' />
					</Button>
				</form>
			</ExpandableChatFooter>
		</>
	);
}

function ChatShell() {
	const { back } = useChatRouter();
	return (
		<>
			<ExpandableChatHeader className='bg-muted/60'>
				<div className='flex gap-5  items-center'>
					<Button onClick={() => back()} variant={"outline"}>
						back
					</Button>
					<div>
						<h1 className='text-xl font-semibold'>--</h1>
						<p>--</p>
					</div>
				</div>
			</ExpandableChatHeader>
			<ExpandableChatBody>
				<ChatMessageList className='bg-muted/25'>
					{/* Initial message */}
					<ChatBubble variant='received'>
						<ChatBubbleAvatar src='' fallback='🤖' />
						<ChatBubbleMessage>Hello! I'm loading your chat please wait...</ChatBubbleMessage>
					</ChatBubble>
				</ChatMessageList>
			</ExpandableChatBody>
			<ExpandableChatFooter className='bg-muted/25'>
				<form className='flex relative gap-2'>
					<ChatInput value={""} className='min-h-12 bg-background shadow-none ' />
					<Button
						className='absolute top-1/2 right-2 transform  -translate-y-1/2'
						type='submit'
						size='icon'
						disabled={false}
					>
						<Send className='size-4' />
					</Button>
				</form>
			</ExpandableChatFooter>
		</>
	);
}

export function ChatSheet() {
	const { thread, loadingThread } = useChat();

	if (loadingThread && !thread) {
		return <ChatShell />;
	}

	return <ThreadMessages />;
}
