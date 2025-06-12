import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "~/functions/get-session";

export const Route = createFileRoute("/_app/(auth)")({
	component: Outlet,
	beforeLoad: async ({ context }) => {
		const { session } = await getSession(context.queryClient);

		if (!session) {
			throw redirect({
				to: "/",
			});
		}
	},
});
