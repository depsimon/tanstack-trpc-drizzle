import { TRPCError } from "@trpc/server";
import { type } from "arktype";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { posts } from "~/db/schema/posts";
import { protectedProcedure, publicProcedure } from "~/trpc/trpc";

export const postsRouter = {
	postCreate: protectedProcedure
		.input(
			type({
				title: "string",
			}),
		)
		.mutation(async ({ input }) => {
			const results = await db.insert(posts).values(input).returning();

			if (results.length === 0) {
				throw new TRPCError({ code: "BAD_REQUEST" });
			}

			return results[0];
		}),
	postById: publicProcedure.input(type("string")).query(async ({ input }) => {
		const results = await db.select().from(posts).where(eq(posts.id, input));

		if (results.length === 0) {
			throw new TRPCError({ code: "NOT_FOUND" });
		}

		return results[0];
	}),
	postList: publicProcedure.query(async () => {
		return await db.select().from(posts).all();
	}),
};
