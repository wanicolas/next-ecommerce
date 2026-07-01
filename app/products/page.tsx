import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProductCatalog } from "./components/product-catalog";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ category?: string }>;
}) {
	const { category } = await searchParams;

	const response = await fetch("https://fakestoreapi.com/products");
	if (!response.ok) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<h2 className="text-2xl font-bold">
					Impossible de charger les produits
				</h2>
				<p className="mt-2 text-muted-foreground">
					Une erreur s&apos;est produite lors de la récupération du catalogue.
					Veuillez réessayer plus tard.
				</p>
			</div>
		);
	}

	const products = await response.json();

	return (
		<div className="animate-in pb-16 duration-300 fade-in">
			{/* Breadcrumbs */}
			<div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
				<Link href="/" className="transition-colors hover:text-foreground">
					Accueil
				</Link>
				<span>/</span>
				<span className="font-medium text-foreground">Produits</span>
			</div>

			{/* Page Header */}
			<div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div>
					<h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
						Nos Produits
					</h1>
					<p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
						Découvrez notre sélection exclusive de vêtements, bijoux et articles
						électroniques de qualité supérieure au meilleur prix.
					</p>
				</div>
				<div className="shrink-0">
					<Badge
						variant="secondary"
						className="px-3 py-1 text-sm font-semibold"
					>
						{products.length} articles disponibles
					</Badge>
				</div>
			</div>

			{/* Interactive Product Catalog */}
			<ProductCatalog products={products} initialCategory={category} />
		</div>
	);
}
