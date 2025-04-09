import { Toaster } from "@/components/ui/toaster";
import { CategoriesProvider } from "@/contexts/ReUsableData";
import Providers from "@/providers/loaderProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AuthProvider from "./auth/Provider";
import "./globals.css";
import CheapChatProvider from "@/firebase/extras/chat/navigation/CheapChatProvider";
import ReactQueryProvider from "@/firebase/providers/ReactQueryProvider";
import ChatBlock from "@/firebase/extras/chat/components/layout/ChatBlock";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "HopterLink - Find, Review, and Connect with Local Gems.",
	description: "Every review tells a story, every story shapes a community.",
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		images: "/hopterlinklogo.png",
	},
	twitter: {
		card: "summary_large_image",
		title: "Hopterlink - Find, Review, and Connect with Local Gems.",
		images: ["https://hopterlink.vercel.app/hopterlinklogo.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<script
					type='text/javascript'
					src='//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
				></script>
			</head>
			<Analytics />
			<body className={poppins.className}>
				<Providers>
					<ReactQueryProvider>
						<ThemeProvider attribute='class' enableSystem>
							<AuthProvider>
								<CategoriesProvider>
									<CheapChatProvider>
										{" "}
										<main className={`flex min-h-screen flex-col`}>{children}</main>
										<Toaster />
										<ChatBlock />
									</CheapChatProvider>
								</CategoriesProvider>
							</AuthProvider>
						</ThemeProvider>
					</ReactQueryProvider>
				</Providers>
			</body>
		</html>
	);
}
