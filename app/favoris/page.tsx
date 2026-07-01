"use client";

import * as React from "react";
import Link from "next/link";
import { useWishlist } from "@/components/wishlist-context";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { StarRating } from "@/components/star-rating";

export default function WishlistPage() {
	const { wishlistItems, toggleWishlist, wishlistCount } = useWishlist();
	const { addToCart } = useCart();

	if (wishlistItems.length === 0) {
		return (
			<div className="mx-auto max-w-md animate-in px-4 py-20 text-center duration-300 fade-in">
				<div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/20">
					<Heart className="h-10 w-10 fill-red-500/10 text-red-500" />
				</div>
				<h1 className="mb-2 text-2xl font-bold tracking-tight">
					Aucun produit favori
				</h1>
				<p className="mb-8 text-sm text-muted-foreground">
					Parcourez nos produits et ajoutez vos articles préférés dans votre
					liste de souhaits.
				</p>
				<Button asChild size="lg" className="font-semibold">
					<Link href="/products">
						Découvrir les produits <ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="animate-in pb-16 duration-300 fade-in">
			<h1 className="mb-8 font-heading text-3xl font-bold tracking-tight">
				Mes Favoris ({wishlistCount}{" "}
				{wishlistCount > 1 ? "articles" : "article"})
			</h1>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{wishlistItems.map((product) => {
					const rating = product.rating || { rate: 0, count: 0 };
					return (
						<Card
							key={product.id}
							className="group relative flex h-full flex-col overflow-hidden rounded-xl border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
						>
							{/* Delete Heart Button Overlay */}
							<button
								onClick={() => toggleWishlist(product)}
								className="absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border/40 bg-white/80 text-muted-foreground shadow-md backdrop-blur transition-all duration-200 hover:bg-red-50 hover:text-red-500 dark:bg-zinc-900/80 dark:hover:bg-red-950/20"
								title="Supprimer des favoris"
							>
								<Trash2 className="h-4 w-4" />
							</button>

							{/* Image Container */}
							<Link href={`/products/${product.id}`} className="block">
								<div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-white p-6">
									<img
										src={product.image}
										alt={product.title}
										className="h-full max-h-[140px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
										loading="lazy"
									/>
								</div>
							</Link>

							{/* Card Body */}
							<CardHeader className="flex-1 space-y-2 p-5 pb-3">
								<div className="flex items-center justify-between gap-2">
									<Badge
										variant="outline"
										className="border-secondary/50 bg-secondary/30 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground capitalize"
									>
										{product.category}
									</Badge>

									{/* Rating */}
									<StarRating rating={product.rating} variant="compact" />
								</div>

								<Link
									href={`/products/${product.id}`}
									className="block transition-colors group-hover:text-primary"
								>
									<CardTitle className="line-clamp-2 min-h-[40px] text-sm leading-snug font-bold">
										{product.title}
									</CardTitle>
								</Link>
							</CardHeader>

							{/* Card Footer: Price & CTA */}
							<CardFooter className="flex flex-col gap-3 p-5 pt-0">
								<div className="flex w-full items-center justify-between">
									<span className="text-base font-extrabold text-foreground">
										{product.price.toFixed(2)} €
									</span>
								</div>
								<Button
									onClick={() => addToCart(product, 1)}
									className="w-full cursor-pointer py-2 text-xs font-semibold"
									size="sm"
								>
									<ShoppingCart className="mr-2 h-3.5 w-3.5" />
									Ajouter au panier
								</Button>
							</CardFooter>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
