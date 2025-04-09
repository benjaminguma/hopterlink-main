import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ChatContext } from "./ChatContext";
import {
	threadsQueryKeys,
	useCreateThread,
	useThread,
	useThreadMessages,
	useUpdateThread,
} from "../threads/services/threads.query";
import { IMessage, IThread } from "../types";
import { useSendMessage } from "./services/chat.query";
import { collection, increment, limit, onSnapshot, query, where } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { COLLECTION_NAMES } from "@/firebase/static";
import { db } from "@/firebase.config";
import useToggle from "@/hooks/useToggle";
import { useAddParticpants } from "../participants/services/participant.query";
import { useAuth } from "@/firebase/auth/context/AuthContext";
import { chatFactories } from "../utils";

export interface IChatProps {
	threadId: string;
	initialThreadData: IThread | null;
}

function ChatProvider(props: PropsWithChildren<IChatProps>) {
	const threadsQuery = useThread(props.threadId);
	const [messages, setMessaages] = useState<IMessage[]>([]);
	const [newMessages, setNewMessaages] = useState<IMessage[]>([]);
	const [startDate, setStartDate] = useState(new Date());
	const createThreadAndPartToog = useToggle();

	const [textInput, setTextInput] = useState("");

	const addParticipantMut = useAddParticpants();
	const addThreadMut = useCreateThread();
	const isSettingUpChat = addParticipantMut.isPending || addThreadMut.isPending;

	const qc = useQueryClient();

	const loadingThread = threadsQuery.isLoading;

	const messagesInfinitqueryResult = useThreadMessages(props.threadId || props.initialThreadData?.id || "");

	const { refetch, isError, isFetchingNextPage, isInitialLoading, isLoading, data, fetchNextPage, hasNextPage } =
		messagesInfinitqueryResult;

	const mess = (
		!data
			? []
			: [...data.pages]

					.map((p) =>
						p.docs.map((d) => {
							return d.data();
						}),
					)
					.flat(1)
					.reverse()
	) as IMessage[];

	useEffect(() => {
		if (mess.length && !isLoading) {
			setMessaages(mess);
		}
	}, [data]);

	const sendMessageMut = useSendMessage();
	const updateThreadMut = useUpdateThread();
	const { user } = useAuth();

	const createThread = async () => {
		try {
			const messages = newMessages;
			const lastMessage = messages[messages.length - 1];
			// console.log(!threadsQuery.data || !props.initialThreadData, props.initialThreadData, threadsQuery.data);

			if (!threadsQuery.data && !props.initialThreadData) {
				return;
			}

			const newThread = threadsQuery.data ? { ...threadsQuery.data } : props.initialThreadData;

			if (!newThread) {
				return;
			}
			newThread.lastSender = lastMessage.senderEmail;

			newThread.unReadCount = messages.length;
			newThread.lastMessage = lastMessage;

			if (threadsQuery.data) {
				updateThreadMut.mutateAsync(newThread);
			} else {
				await addThreadMut.mutateAsync(newThread);
			}

			await Promise.all([
				// await updateThreadMut.mutateAsync(newThread),
				await sendMessageMut.mutateAsync(messages),
				await addParticipantMut.mutateAsync(newThread.participantDetails),
			]);

			threadsQuery.refetch();
			qc.invalidateQueries({
				queryKey: [threadsQueryKeys.base],
			});
			messagesInfinitqueryResult.refetch();
		} catch (error) {
			console.log(error);
		}
	};

	const newMsgs = JSON.stringify(newMessages);

	useEffect(() => {
		if (newMessages.length) {
			createThread();
		}
	}, [newMsgs]);

	const craftMessage = (): IMessage => {
		return chatFactories.createNewMessage({
			threadId: props.threadId || props.initialThreadData?.id,
			senderEmail: btoa(user?.email || ""),
			text: textInput,
			senderId: btoa(user?.email || ""),
			id: window.crypto.randomUUID(),
		});
	};

	const sendMessage = async () => {
		try {
			const messages = [craftMessage()];
			setMessaages((prev) => [...messages, ...prev]);

			setNewMessaages(messages);
			setTextInput("");
		} catch (error) {
			console.log(error);
			console.log("error sending message");
		}
	};

	// console.log(messages);
	const handleThreadViewed = async () => {
		if (!threadsQuery.data) return;

		try {
			const newThread = { ...threadsQuery.data };
			if (newThread.unReadCount === 0) {
				return;
			}
			newThread.unReadCount = 0;

			updateThreadMut.mutateAsync(newThread);
			threadsQuery.refetch();
		} catch (error) {
			console.log("error reading thread viewed", error);
		}
	};

	useEffect(() => {
		const q = query(
			collection(
				db,
				COLLECTION_NAMES.THREADS,
				props.threadId || props.initialThreadData?.id || "",
				COLLECTION_NAMES.MESSAGES,
			),
			where("createdAt", ">", new Date()),
			limit(20),
		);
		const unsubscribe = onSnapshot(q, async (snapshot) => {
			let isNew = false;
			snapshot.docChanges().forEach((change) => {
				const m1 = change.doc.data() as IMessage;
				if (change.type === "added" && !newMessages.find((m) => m.id !== m1.id)) {
					isNew = true;
				} else {
					setMessaages((p) => [...p, m1]);
				}
			});

			if (isNew) {
				messagesInfinitqueryResult.refetch();
				threadsQuery.refetch();
				setStartDate(new Date());
			} else {
				setNewMessaages([]);
			}
		});

		return () => unsubscribe();
	}, [startDate]);

	return (
		<ChatContext.Provider
			value={{
				sendMessage,
				loadingThread,
				thread: threadsQuery.data || props.initialThreadData,
				messages: messages,
				handleThreadViewed,
				viewerEmail: user?.email || "",
				textInput,
				setTextInput,
			}}
		>
			{props.children}
		</ChatContext.Provider>
	);
}

export default ChatProvider;
