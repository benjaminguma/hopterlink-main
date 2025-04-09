import { ulid } from "ulid";
import { IMessage, IParticipant, IThread } from "./types";
import { Timestamp } from "firebase/firestore";

const hashValue = async (val: string) =>
	await crypto.subtle.digest("SHA-256", new TextEncoder().encode(val)).then((h) => {
		let hexes = [],
			view = new DataView(h);
		for (let i = 0; i < view.byteLength; i += 4)
			hexes.push(("00000000" + view.getUint32(i).toString(16)).slice(-8));
		return hexes.join("");
	});

export function createNewParticipant(
	data: Partial<
		Pick<IParticipant, "userId" | "externalId" | "email" | "fullName" | "phone" | "photoURL" | "isOnline">
	>,
): IParticipant {
	const now = Timestamp.now();
	return {
		userId: data.userId || "",
		externalId: data.externalId || data.email || "",
		type: "business",
		email: btoa(data.email || ""),
		fullName: data.fullName || "",
		lastSeen: now,
		isOnline: false,
		photoURL: data.photoURL || "",
		createdAt: now,
		updatedAt: now,
		phone: data.phone || "",
	};
}

export async function createNewThread(
	data: Pick<IThread, "name" | "participantEmails" | "participantDetails" | "ownerEmail">,
): Promise<IThread> {
	const threadId = btoa(data.participantEmails.join(""));
	return {
		id: threadId,
		name: data.name || "",
		participantEmails: data.participantEmails || [],
		participantDetails: data.participantDetails || [],
		lastMessage: null,
		unReadCount: 0,
		createdAt: Timestamp.now(),
		updatedAt: Timestamp.now(),

		ownerEmail: data.ownerEmail || "",
	};
}

export function createNewMessage(
	data: Partial<Pick<IMessage, "senderEmail" | "threadId" | "senderId" | "text" | "id">>,
): IMessage {
	console.log("came to create");

	return {
		id: data.id || Math.random().toString(),
		text: data?.text || "",
		sent: true,
		read: false,
		senderId: data?.senderId || "",
		senderEmail: data?.senderEmail || "",
		threadId: data?.threadId || "",
		pending: true,
		createdAt: Timestamp.now(),
		updatedAt: Timestamp.now(),
	};
}

export const chatFactories = {
	createNewParticipant,
	createNewMessage,
	createNewThread,
};

export const resolveChatInfo = (thread?: IThread | null, viewer?: string) => {
	if (!thread) {
		return {
			sender: null,
			recipients: [],
			isGroup: false,
		};
	}
	const sender = thread.participantDetails.find((pp) => atob(pp.email) == viewer);

	const recipients = thread.participantDetails.filter((pp) => atob(pp.email) !== viewer);

	return {
		sender,
		recipients,
		isGroup: thread.participantDetails.length > 2,
	};
};

export function cloneObj(object: object) {
	return JSON.parse(JSON.stringify(object));
}

// const { startChat } = useChatRouter();  // you only need arouter on web not mobile
// 	const auth = useAuth();
// 	const { userInfo } = useCategories();
// 	const business = businessInfo;

// 	const setupChat = async () => {
// 		const loggedInUser = userInfo;

// 		try {
// 			if (!business?.owner || !business?.owner?.email || !loggedInUser) {
// 				return;
// 			}
// 			const { owner } = business;
// 			const p2 = chatFactories.createNewParticipant({
// 				email: owner.email,
// 				fullName: owner.first_name + " " + owner.last_name,
// 				userId: owner.email,
// 				phone: business.business_phone_1 || business.business_phone_2,
// 				photoURL: business.images[0]?.image,
// 				externalId: owner.email,
// 			});

// 			const p1 = chatFactories.createNewParticipant({
// 				email: loggedInUser.email,
// 				fullName: loggedInUser.first_name + " " + loggedInUser.last_name,
// 				userId: auth.user?.uid,
// 				phone: loggedInUser.phone,
// 				photoURL: loggedInUser.profile || "",
// 				externalId: loggedInUser.email,
// 				isOnline: true,
// 			});

// 			const thread = await chatFactories.createNewThread({
// 				name: business.business_name,
// 				participantDetails: [p1, p2],
// 				participantEmails: [p1.email, p2.email],
// 				ownerEmail: p1.email,
// 			});
// 			// await addParticipantMut.mutateAsync([p1, p2]);
// 			// await addThreadMut.mutateAsync(thread);

// 			console.log(thread);

// 			startChat({ thread });
// 		} catch (error) {
// 			console.log(error);

// 			console.log("failed to setup chat");
// 		}
// 	};
