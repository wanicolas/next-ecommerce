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
				<h2 className="text-2xl font-bold">Impossible de charger les produits</h2>
				<p className="mt-2 text-muted-foreground">
					Une erreur s'est produite lors de la récupération du catalogue. Veuillez réessayer plus tard.
				</p>
			</div>
		);
	}

	const products = await response.json();

	return (
		<div className="pb-16 animate-in fade-in duration-300">
			{/* Breadcrumbs */}
			<div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
				<Link href="/" className="hover:text-foreground transition-colors">
					Accueil
				</Link>
				<span>/</span>
				<span className="text-foreground font-medium">Produits</span>
			</div>

			{/* Page Header */}
			<div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
						Nos Produits
					</h1>
					<p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
						Découvrez notre sélection exclusive de vêtements, bijoux et articles électroniques de qualité supérieure au meilleur prix.
					</p>
				</div>
				<div className="shrink-0">
					<Badge variant="secondary" className="px-3 py-1 font-semibold text-sm">
						{products.length} articles disponibles
					</Badge>
				</div>
			</div>

			{/* Interactive Product Catalog */}
			<ProductCatalog products={products} initialCategory={category} />
		</div>
	);
}
