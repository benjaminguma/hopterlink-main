import useHandleRQError from "@/hooks/useHandleRQError";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { IParticipant, IThread } from "../../types";
import { ThreadsService } from "./threads.service";
import { AuthStatus, useAuth } from "@/firebase/auth/context/AuthContext";

export const threadsQueryKeys = {
	base: "threads",
	messages: (threadId: string) => [threadsQueryKeys.base, "messages", threadId],
};

export function useListThreads(email: string) {
	const { authStatus } = useAuth();

	return useInfiniteQuery({
		queryKey: [threadsQueryKeys.base, email],
		queryFn: async ({ pageParam }) => {
			return await ThreadsService.listThreads(email);
		},
		/////
		getNextPageParam(lastPage, allPages) {
			if (!lastPage.length) {
				const docs = lastPage?.docs;

				const lastDocIndex = docs?.length - 1;
				const last = docs[lastDocIndex].data();
				return last.updatedAt;
			}
		},
		gcTime: 10 * 60 * 1000,
		staleTime: 10000,
		refetchOnMount: true,
		initialPageParam: "",
		// enabled: authStatus === AuthStatus.AUTHENTICATED,
	});

	// useHandleRQError(queryChunk, {
	// 	toastId: "err_getting_part",
	// });
}

export function useThreadMessages(threadId: string) {
	return useInfiniteQuery({
		queryKey: threadsQueryKeys.messages(threadId),
		queryFn: async ({ pageParam }) => {
			return await ThreadsService.listThreadMessages(threadId);
		},
		getNextPageParam(lastPage, allPages) {
			if (!lastPage.empty) {
				const docs = lastPage.docs;
				const lastDocIndex = docs.length - 1;
				const last = docs[lastDocIndex].data();
				return last.id;
			}
		},
		gcTime: 50 * 60 * 1000,
		staleTime: 10000000,
		refetchOnMount: true,
		initialPageParam: "",
	});
}

export function useCreateThread() {
	return useMutation({
		mutationFn: ThreadsService.createThread,
	});
}
export function useUpdateThread() {
	return useMutation({
		mutationFn: ThreadsService.updateThread,
	});
}

export function useThread(threadId: string) {
	const queryChunk = useQuery({
		queryKey: [threadsQueryKeys.base, threadId],
		queryFn: async ({ queryKey }) => {
			return await ThreadsService.getThreadById(String(queryKey[1]));
		},
		select(data) {
			return data.data() as IThread;
		},
		retry: 2,
		staleTime: 40 * 60 * 1000,
		gcTime: 40 * 60 * 1000,
	});

	useHandleRQError(queryChunk, {
		toastId: "err_getting_td",
	});

	return queryChunk;
}
