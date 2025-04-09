import React, { PropsWithChildren, useEffect, useState } from "react";
import { ThreadContext } from "./ThreadContext";
import { IMessage, IThread, IThreadFilter } from "../../types";
import { threadsQueryKeys, useListThreads } from "../services/threads.query";
import { useAuth } from "@/firebase/auth/context/AuthContext";
import { collection, increment, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase.config";
import { COLLECTION_NAMES } from "@/firebase/static";
import { toast } from "@/components/ui-hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

function ThreadProvider(props: PropsWithChildren) {
	const [startDate, setStartDate] = useState(new Date());
	const { user } = useAuth();
	const email = btoa(user?.email || "");

	const qc = useQueryClient();

	const threadsQuery = useListThreads(email);
	const { refetch, isError, isFetchingNextPage, isInitialLoading, isLoading, data, fetchNextPage, hasNextPage } =
		threadsQuery;

	const threads = (
		!data
			? []
			: data.pages
					.map((p) =>
						p.docs.filter((d) => d.data().participantEmails.includes(email)).map((d) => d.data()),
					)
					.flat(1)
	) as IThread[];
	// console.log("threadsssss");
	// console.log(threads);
	// console.log("=====");
	async function createThread(data: IThread): Promise<boolean> {
		return true;
	}

	async function handleThreadOpened(threadId: string): Promise<boolean> {
		return true;
	}
	async function getThreadMessages(threadId: string, filter: IThreadFilter): Promise<IMessage[]> {
		return [];
	}
	async function getUserThreads(): Promise<IThread[]> {
		threadsQuery.refetch();
		return [];
	}

	async function getThread(id: string) {
		return null;
	}

	useEffect(() => {
		const q = query(
			collection(db, COLLECTION_NAMES.THREADS),
			// where("participantEmails", "array-contains", btoa(email)),
			orderBy("updatedAt", "desc"),
		);
		const unsubscribe = onSnapshot(q, async (snapshot) => {
			let isNew = false;
			snapshot.docChanges().forEach((change) => {
				const thread = change.doc.data() as IThread;

				if (thread.id && change.type === "modified") {
					qc.invalidateQueries({
						queryKey: threadsQueryKeys.messages(thread.id),
						exact: true,
					});
				}
				isNew = true;

				// Todo: fix later ony the one that concerns the user

				if (change.doc.data().participantEmails.includes(btoa(email)) && !/chat|thread/.test(p)) {
					//
				}
			});

			if (isNew) {
				threadsQuery.refetch();
			}
		});

		return () => unsubscribe();
	}, [startDate]);

	return (
		<ThreadContext.Provider
			value={{
				createThread,
				threads,
				handleThreadOpened,
				getThreadMessages,
				getUserThreads,
				getThread,
				loadingThreads: isLoading,
				viewerId: email,
			}}
		>
			{props.children}
		</ThreadContext.Provider>
	);
}

export default ThreadProvider;
