import * as React from "react";
import Link from "next/link";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist-button";

export default async function Page() {
	const response = await fetch("https://fakestoreapi.com/products");
	if (!response.ok) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<h2 className="text-2xl font-bold">
					Impossible de charger les produits
				</h2>
				<p className="mt-2 text-muted-foreground">
					Une erreur s'est produite lors de la récupération du catalogue.
					Veuillez réessayer plus tard.
				</p>
			</div>
		);
	}

	const products: {
		id: number;
		title: string;
		price: number;
		description: string;
		category: string;
		image: string;
		rating?: {
			rate: number;
			count: number;
		};
	}[] = await response.json();

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

			{/* Products Grid */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
				{products.map((product) => {
					const rating = product.rating || { rate: 0, count: 0 };
					return (
						<Link
							href={"/products/" + product.id}
							key={product.id}
							className="group"
						>
							<Card className="flex h-full flex-col overflow-hidden rounded-xl border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
								{/* Uniform Image Container (white bg to look clean with fakestoreapi images) */}
								<div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-white p-6">
									<img
										src={product.image}
										alt={product.title}
										className="h-full max-h-[160px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
										loading="lazy"
									/>
									<WishlistButton
										product={product}
										className="absolute top-3 right-3 z-10"
									/>
								</div>

								{/* Card Content & Text */}
								<CardHeader className="flex-1 space-y-2 p-6 pb-3">
									<div className="flex items-center justify-between gap-2">
										<Badge
											variant="outline"
											className="border-secondary/50 bg-secondary/30 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground capitalize"
										>
											{product.category}
										</Badge>

										{/* Rating summary */}
										{rating.count > 0 && (
											<div className="flex items-center gap-1 text-xs">
												<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
												<span className="font-semibold text-foreground">
													{rating.rate.toFixed(1)}
												</span>
												<span className="text-muted-foreground">
													({rating.count})
												</span>
											</div>
										)}
									</div>

									<CardTitle className="line-clamp-2 min-h-[48px] text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
										{product.title}
									</CardTitle>

									<CardDescription className="line-clamp-2 pt-1 text-xs leading-relaxed text-muted-foreground">
										{product.description}
									</CardDescription>
								</CardHeader>

								{/* Card Footer: Price & CTA */}
								<CardFooter className="mt-auto flex items-center justify-between p-6 pt-0">
									<span className="text-lg font-extrabold text-foreground">
										{product.price.toFixed(2)} €
									</span>
									<span className="flex items-center gap-1 text-xs font-bold text-primary transition-all group-hover:underline">
										Voir le produit <ArrowRight className="h-3.5 w-3.5" />
									</span>
								</CardFooter>
							</Card>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
