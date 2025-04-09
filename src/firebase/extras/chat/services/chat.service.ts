import { collection, deleteDoc, doc, setDoc, startAfter, Timestamp, where } from "firebase/firestore";
import { IMessage, IParticipant, IThread, IThreadFilter } from "../../types";
import { db } from "@/firebase.config";
import { COLLECTION_NAMES } from "@/firebase/static";
export class ChatService {
	static async sendMessages(messages: IMessage[]) {
		const threadId = messages[0].threadId;

		await Promise.all(
			messages.map(
				async (mess) =>
					await setDoc(
						doc(db, COLLECTION_NAMES.THREADS, threadId, COLLECTION_NAMES.MESSAGES, mess.id),
						mess,
					),
			),
		);
	}

	static async deleteMessages(messages: IMessage[]) {
		const threadId = messages[0].threadId;

		await Promise.all(
			messages.map(
				async (mess) =>
					await deleteDoc(
						doc(db, COLLECTION_NAMES.THREADS, threadId, COLLECTION_NAMES.MESSAGES, mess.id),
					),
			),
		);
	}
}
