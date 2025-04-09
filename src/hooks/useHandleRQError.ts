import { toast } from "@/components/ui-hooks/use-toast";
import { UseInfiniteQueryResult, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { useEffect } from "react";

export default function useHandleRQError(
	query: UseQueryResult | UseInfiniteQueryResult,
	options: {
		errorMessage?: string;
		successMessage?: string;
		toastId: string;
	},
) {
	const { isLoading, isError } = query;
	useEffect(() => {
		if (isError) {
			toast({
				title: "An error occured",
				description: "error occured while fetching data",
				variant: "destructive",
			});
		}
	}, [isLoading, isError]);
}
