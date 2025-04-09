import useHandleRQError from "@/hooks/useHandleRQError";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { IParticipant, IThread } from "../../types";
import { ChatService } from "./chat.service";

const keys = {
	base: "message",
	messages: (threadId: string) => [keys.base, "messages", threadId],
};

export function useSendMessage() {
	return useMutation({
		mutationFn: ChatService.sendMessages,
	});

	// useHandleRQError(queryChunk, {
	// 	toastId: "err_getting_part",
	// });
}
export function useDeleteMessages() {
	return useMutation({
		mutationFn: ChatService.deleteMessages,
	});

	// useHandleRQError(queryChunk, {
	// 	toastId: "err_getting_part",
	// });
}
