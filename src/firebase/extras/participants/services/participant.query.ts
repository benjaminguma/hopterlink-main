import useHandleRQError from "@/hooks/useHandleRQError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ParticipantService } from "./participant.service";
import { IParticipant } from "../../types";

const participantQueryKeys = {
	base: "part",
};

export function useParticipant(email: string) {
	const queryChunk = useQuery({
		queryKey: [participantQueryKeys.base, email],
		queryFn: async ({ queryKey }) => ParticipantService.getParticipantByEmail(String(queryKey[1])),
		select(data) {
			return data.data() as IParticipant;
		},
	});

	useHandleRQError(queryChunk, {
		toastId: "err_getting_part",
	});

	return queryChunk;
}

export function useAddParticpants() {
	return useMutation({
		mutationFn: ParticipantService.createParticipants,
	});
}
export function useUpdateParticpantDetails() {
	return useMutation({
		mutationFn: ParticipantService.updateParticipantDetails,
	});
}
