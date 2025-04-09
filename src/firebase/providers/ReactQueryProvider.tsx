"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const reactQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 10 * 60 * 1000,
			refetchOnReconnect: true,
		},
		mutations: {
			onError(error, variables, context) {
				console.log("mutation failed  ", error);
			},
			retry: false,
		},
	},
});

function ReactQueryProvider({ children }: PropsWithChildren) {
	const [client] = useState(reactQueryClient);
	return (
		<QueryClientProvider client={client}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default ReactQueryProvider;
