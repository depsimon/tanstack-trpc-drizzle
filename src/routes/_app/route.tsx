import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "~/components/layout";
import { getSession } from "~/functions/get-session";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const { session } = await getSession(context.queryClient);

		return {
			session,
		};
	},
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	return (
		<Layout user={session?.user}>
			<Outlet />
		</Layout>
	);
}
