import {
	collection,
	deleteDoc,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	increment,
	limit,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	startAfter,
	Timestamp,
	where,
} from "firebase/firestore";
import { IMessage, IParticipant, IThread, IThreadFilter } from "../../types";
import { db } from "@/firebase.config";
import { COLLECTION_NAMES } from "@/firebase/static";

export class ThreadsService {
	static async createThread(data: IThread): Promise<IThread> {
		const collectionRef = collection(db, COLLECTION_NAMES.THREADS);

		const document = doc(db, COLLECTION_NAMES.THREADS, data.id);

		await setDoc(document, data);

		return data;
	}

	static async listThreads(participantEmail: string) {
		const collectionRef = collection(db, COLLECTION_NAMES.THREADS);
		console.log(participantEmail);
		const threadsQuery = query(collectionRef, orderBy("updatedAt", "desc"));
		const docs = await getDocs<DocumentData, DocumentData>(threadsQuery);

		return docs;
	}

	static async getThreadById(id: string) {
		return await getDoc(doc(db, COLLECTION_NAMES.THREADS, id));
	}

	static async deleteThread(threadId: string) {
		await deleteDoc(doc(db, COLLECTION_NAMES.THREADS, threadId));
		return true;
	}

	static async updateThread(data: IThread) {
		data.updatedAt = Timestamp.now();
		return await setDoc(
			doc(db, COLLECTION_NAMES.THREADS, data.id),
			{ ...data, unReadCount: data.unReadCount ? increment(data.unReadCount) : 0 },
			{ merge: true },
		);
	}

	static async listThreadMessages(
		threadId: string,
		filter: IThreadFilter = { pageSize: 20, lastMessageId: "", sort: "createdAt" },
	) {
		const sort = filter.sort || "createdAt";
		const threadsCollRef = collection(db, COLLECTION_NAMES.THREADS, threadId, COLLECTION_NAMES.MESSAGES);

		if (filter.lastMessageId) {
			return await getDocs(
				query(
					threadsCollRef,
					orderBy(sort, "desc"),
					startAfter(filter.lastMessageId),
					limit(filter.pageSize || 20),
				),
			);
		}

		const threadsQuery = query(threadsCollRef, orderBy(sort, "desc"), limit(filter.pageSize || 20));

		const docs = await getDocs<DocumentData, DocumentData>(threadsQuery);

		return docs;
	}
}
