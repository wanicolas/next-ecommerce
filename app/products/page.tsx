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

export default async function Page() {
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

			{/* Products Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
				{products.map((product) => {
					const rating = product.rating || { rate: 0, count: 0 };
					return (
						<Link
							href={"/products/" + product.id}
							key={product.id}
							className="group"
						>
							<Card className="h-full flex flex-col overflow-hidden border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl">
								{/* Uniform Image Container (white bg to look clean with fakestoreapi images) */}
								<div className="bg-white p-6 aspect-[4/3] flex items-center justify-center relative overflow-hidden border-b border-border">
									<img
										src={product.image}
										alt={product.title}
										className="h-full max-h-[160px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
										loading="lazy"
									/>
								</div>

								{/* Card Content & Text */}
								<CardHeader className="flex-1 p-6 space-y-2 pb-3">
									<div className="flex items-center justify-between gap-2">
										<Badge
											variant="outline"
											className="capitalize text-[10px] px-2 py-0.5 font-semibold bg-secondary/30 text-secondary-foreground border-secondary/50"
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

									<CardTitle className="line-clamp-2 text-base font-bold text-foreground group-hover:text-primary transition-colors min-h-[48px] leading-snug">
										{product.title}
									</CardTitle>

									<CardDescription className="line-clamp-2 text-xs text-muted-foreground leading-relaxed pt-1">
										{product.description}
									</CardDescription>
								</CardHeader>

								{/* Card Footer: Price & CTA */}
								<CardFooter className="p-6 pt-0 flex items-center justify-between mt-auto">
									<span className="text-lg font-extrabold text-foreground">
										{product.price.toFixed(2)} €
									</span>
									<span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1 transition-all">
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
