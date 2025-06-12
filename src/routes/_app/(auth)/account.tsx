import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(auth)/account")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						Account
					</h1>
				</div>
			</header>
			<main>
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					Welcome in your dashboard
				</div>
			</main>
		</>
	);
}
