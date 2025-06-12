import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";

export const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const request = getWebRequest();
		const session = await auth.api.getSession({
			headers: request?.headers ?? new Headers(),
		});

		return await next({
			context: {
				user: session?.user,
			},
		});
	},
);
