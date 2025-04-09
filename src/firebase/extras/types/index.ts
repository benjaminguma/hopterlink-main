import { Timestamp } from "firebase/firestore";

export interface Base {
	updatedAt: Timestamp;
	createdAt: Timestamp;
}
export interface IParticipant extends Base {
	userId: string;
	externalId?: string;
	type: "user" | "business";
	email: string;
	fullName: string;
	lastSeen: Timestamp;
	isOnline: boolean;
	photoURL: string;
	phone: string;
}

export interface IMessage extends Base {
	id: string;
	text: string;
	sent: boolean;
	read: boolean;
	senderId: string;
	senderEmail: string;
	threadId: string;
	pending: boolean;
}
export interface IThread extends Base {
	id: string;
	name: string;
	participantEmails: string[];
	participantDetails: IParticipant[]; // makeshift
	lastMessage: IMessage;
	unReadCount: number;
	ownerEmail: string;
	lastSender?: string;
}
export interface IThreadFilter {
	pageSize?: number;
	lastMessageId?: string;
	sort?: string;
}
export interface IThreadContext {
	createThread: (data: IThread) => Promise<boolean>;
	threads: IThread[];
	handleThreadOpened: (threadId: string) => Promise<boolean>;
	getThreadMessages: (threadId: string, filter: IThreadFilter) => Promise<IMessage[]>;
	getUserThreads: () => Promise<IThread[]>;
	getThread: (id: string) => Promise<IThread | null>;
	loadingThreads: boolean;
	viewerId: string;
}

export interface IChatContext {
	sendMessage(message: IMessage): Promise<IMessage>;
	messages: IMessage[];
	loadMoreMessages(): Promise<void>;
}
