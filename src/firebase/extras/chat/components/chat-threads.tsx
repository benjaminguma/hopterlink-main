import React, { useEffect } from "react";
import { ExpandableChatBody, ExpandableChatFooter, ExpandableChatHeader } from "./ui/chat/expandable-chat";
import Image from "next/image";
import { IThread } from "../../types";
import { useThreads } from "../../threads/context/ThreadContext";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "@/firebase/auth/context/AuthContext";
import { useChatRouter } from "../navigation/cheapChatContext";
import { Button } from "./ui/button";

dayjs.extend(relativeTime); // use plu

function ChatThreads() {
	const x = useThreads();
	const { loadingThreads, threads } = x;
	const { user } = useAuth();
	const { closeChat } = useChatRouter();

	useEffect(() => {
		x.getUserThreads();
	}, []);
	return (
		<>
			<ExpandableChatHeader className='bg-muted/60 px-5 flex text-center justify-between items-center'>
				<h1 className='text-xl font-semibold'>Messages</h1>

				<Button onClick={() => closeChat()} variant={"outline"}>
					close
				</Button>
			</ExpandableChatHeader>
			<ExpandableChatBody>
				{loadingThreads && <p className='text-lg text-neutral-600'>loading.......</p>}

				{threads && !threads.length && <p className='text-lg  text-neutral-600'>no chats</p>}

				{threads && threads.length && threads.map((thread, index) => <ThreadItem thread={thread} />)}
			</ExpandableChatBody>
		</>
	);
}

export default ChatThreads;

export interface IThreadItemProps {
	thread: IThread;
}

function ThreadItem({ thread }: IThreadItemProps) {
	const { viewerId } = useThreads();

	const participantToRender = thread.participantDetails.find((p) => p.externalId !== atob(viewerId));
	const { push } = useChatRouter();
	if (!participantToRender) {
		return null;
	}

	function viewThread() {
		push({
			type: "VIEW_THREAD",
			payload: {
				id: thread.id,
			},
		});
	}
	return (
		<div
			className='flex gap-2 py-3 px-5 cursor-pointer  border-b  hover:bg-white/20'
			onClick={() => viewThread()}
		>
			<figure className='rounded-full w-[50px] h-[50px]'>
				<Image
					src={"https://api.dicebear.com/9.x/identicon/png?seed=" + participantToRender.fullName}
					width={50}
					height={50}
					alt={participantToRender.fullName}
					objectFit='fill'
					className='rounded-full'
				/>
			</figure>
			<div className='flex-1 flex justify-between  items-center  text-foreground'>
				<div className='grid gap-3'>
					<h1 className='text-md font-semibold'>{participantToRender.fullName}</h1>

					{thread.lastMessage ? (
						<p className='text-sm text-neutral-400'>
							{thread.lastMessage.text.length < 20
								? thread.lastMessage.text
								: thread.lastMessage.text.slice(0, 20) + "..."}
						</p>
					) : null}
				</div>
				<div className='flex flex-col gap-3 items-end'>
					<p className='text-sm text-neutral-500'>
						{" "}
						{dayjs(thread.lastMessage?.createdAt.toMillis()).fromNow()}
					</p>
					{thread.unReadCount && thread.lastSender !== viewerId ? (
						<span className='text-sm grid place-content-center bg-primary w-[19px] h-[19px] rounded-full text-white'>
							{thread.unReadCount}
						</span>
					) : null}
				</div>
			</div>
		</div>
	);
}
