import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner";
import superjson from "superjson";
import { getIsomorphicHeaders } from "~/functions/get-headers";
import { parseError } from "~/lib/errors";
import type { TRPCRouter } from "~/trpc";
import { TRPCProvider } from "~/trpc/client";

const queryClient: QueryClient = new QueryClient({
	defaultOptions: {
		dehydrate: { serializeData: superjson.serialize },
		hydrate: { deserializeData: superjson.deserialize },
		queries: {
			refetchOnReconnect: () => !queryClient.isMutating(),
			staleTime: 60_000,
		},
	},
	mutationCache: new MutationCache({
		onError: (error) => {
			const { title } = parseError(error);

			toast.error(title);
		},
		onSettled: () => {
			if (queryClient.isMutating() === 1) {
				return queryClient.invalidateQueries();
			}
		},
	}),
	queryCache: new QueryCache({
		onError: (error) => {
			const { title } = parseError(error);

			toast.error(title, {
				action: {
					label: "Retry",
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},
	}),
});

function getUrl() {
	const base = (() => {
		if (typeof window !== "undefined") return "";
		return `http://localhost:${process.env.PORT ?? 3000}`;
	})();

	return `${base}/api/trpc`;
}

export const trpcClient = createTRPCClient<TRPCRouter>({
	links: [
		httpBatchStreamLink({
			transformer: superjson,
			url: getUrl(),
			headers() {
				// Important to use isomorphic headers
				return getIsomorphicHeaders();
			},
		}),
	],
});

const serverHelpers = createTRPCOptionsProxy({
	client: trpcClient,
	queryClient: queryClient,
});

export function getContext() {
	return {
		queryClient,
		trpc: serverHelpers,
	};
}

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
			{children}
		</TRPCProvider>
	);
}
