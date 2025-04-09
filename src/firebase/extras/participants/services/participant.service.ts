import {
	collection,
	deleteDoc,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	setDoc,
	startAfter,
	Timestamp,
	where,
} from "firebase/firestore";
import { IMessage, IParticipant, IThread, IThreadFilter } from "../../types";
import { db } from "@/firebase.config";
import { COLLECTION_NAMES } from "@/firebase/static";
export class ParticipantService {
	static async createParticipants(participants: IParticipant[]) {
		await Promise.all(
			participants.map(async (par) => {
				const existing = await getDoc(doc(db, COLLECTION_NAMES.CHAT_PARTICIPANTS, par.email));
				if (!existing.data()) {
					return await setDoc(doc(db, COLLECTION_NAMES.CHAT_PARTICIPANTS, par.email), par);
				}
			}),
		);

		return true;
	}

	static async getParticipantByEmail(email: string) {
		return await getDoc(doc(db, COLLECTION_NAMES.CHAT_PARTICIPANTS, email));
	}

	static async updateParticipantDetails(par: Partial<IParticipant>) {
		return await setDoc(doc(db, COLLECTION_NAMES.CHAT_PARTICIPANTS), par, { merge: true });
	}
}
