import { MessageCircleDashed } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/cards";
import GridPattern from "./magicui/animated-grid-patter";
import { chatFactories } from "@/firebase/extras/utils";
import { useCategories } from "@/contexts/ReUsableData";
import { useAuth } from "@/firebase/auth/context/AuthContext";
import { useChatRouter } from "@/firebase/extras/chat/navigation/cheapChatContext";
export interface BusinessOwner {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	profile: object;
	is_business: boolean;
}

export interface BusinessIndustry {
	id: number;
	name: string;
	icon: string;
	description: string;
	created_at: string;
	updated_at: string;
}

export interface BusinessIndustry_subcategory {
	id: number;
	name: string;
	display_name: string;
	created_at: string;
	updated_at: string;
}

export interface BusinessImage {
	id: number;
	image: string;
	thumbnail: string;
}

export interface BusinessData {
	id: number;
	owner: BusinessOwner;
	email: string;
	logo: string;
	business_name: string;
	description: string;
	location: string;
	industry: BusinessIndustry;
	industry_subcategory: BusinessIndustry_subcategory;
	images: BusinessImage[];
	website: string;
	business_phone_1: string;
	business_phone_2: string;
	min_delivery_time_in_days: number;
	max_delivery_time_in_days: number;
	is_kyc_verified: boolean;
	is_active: boolean;
	is_deleted: boolean;
	toc_accepted: boolean;
	business_reg_no: string;
	reviews: undefined[];
	average_rating: number;
	in_collection: boolean;
}

interface Props {
	businessInfo: BusinessData;
}

const BusinessCTA = ({ businessInfo }: Props) => {
	const { startChat } = useChatRouter();
	const auth = useAuth();
	const { userInfo } = useCategories();
	const business = businessInfo;

	const setupChat = async () => {
		const loggedInUser = userInfo;

		try {
			if (!business?.owner || !business?.owner?.email || !loggedInUser) {
				return;
			}
			const { owner } = business;
			const p2 = chatFactories.createNewParticipant({
				email: owner.email,
				fullName: owner.first_name + " " + owner.last_name,
				userId: owner.email,
				phone: business.business_phone_1 || business.business_phone_2,
				photoURL: business.images[0]?.image,
				externalId: owner.email,
			});

			const p1 = chatFactories.createNewParticipant({
				email: loggedInUser.email,
				fullName: loggedInUser.first_name + " " + loggedInUser.last_name,
				userId: auth.user?.uid,
				phone: loggedInUser.phone,
				photoURL: loggedInUser.profile || "",
				externalId: loggedInUser.email,
				isOnline: true,
			});

			const thread = await chatFactories.createNewThread({
				name: business.business_name,
				participantDetails: [p1, p2],
				participantEmails: [p1.email, p2.email],
				ownerEmail: p1.email,
			});
			// await addParticipantMut.mutateAsync([p1, p2]);
			// await addThreadMut.mutateAsync(thread);

			console.log(thread);

			startChat({ thread });
		} catch (error) {
			console.log(error);

			console.log("failed to setup chat");
		}
	};

	return (
		<div className='relative mt-4'>
			<Card>
				<GridPattern maxOpacity={0.1} numSquares={4} width={100} height={100} />
				<CardHeader>
					<CardTitle className='text-center'>
						Connect with {businessInfo?.business_name} right through Hopterlink
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Button className='w-full flex gap-2' variant={"secondary"} onClick={setupChat}>
						<MessageCircleDashed /> Message Owner
					</Button>{" "}
				</CardContent>
			</Card>
		</div>
	);
};

export default BusinessCTA;
