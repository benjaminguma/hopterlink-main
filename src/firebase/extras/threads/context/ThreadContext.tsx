import { createContext, useContext } from "react";

import { IThread, IThreadContext } from "../../types";

export const ThreadContext = createContext<IThreadContext>({
	async createThread(data) {
		return true;
	},
	threads: [] as IThread[],
	async handleThreadOpened(id) {
		return true;
	},
	async getThreadMessages(threadId, filter) {
		return [];
	},
	async getUserThreads() {
		return [];
	},

	async getThread(id: string) {
		return null;
	},
	viewerId: "",
	loadingThreads: false,
});

export function useThreads() {
	return useContext(ThreadContext);
}
