import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "~/trpc/client";

export const Route = createFileRoute("/_app/post/$postId")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			context.trpc.post.postById.queryOptions(params.postId),
		);
	},
});

function RouteComponent() {
	const trpc = useTRPC();
	const { postId } = Route.useParams();
	const { data: post } = useQuery(trpc.post.postById.queryOptions(postId));

	return (
		<>
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						{post?.title}
					</h1>
				</div>
			</header>
			<main>
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					Post content
				</div>
			</main>
		</>
	);
}
