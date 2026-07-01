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
import { Trash2, ShoppingCart, Heart, ArrowRight, Star } from "lucide-react";

export default function WishlistPage() {
	const { wishlistItems, toggleWishlist, wishlistCount } = useWishlist();
	const { addToCart } = useCart();

	if (wishlistItems.length === 0) {
		return (
			<div className="max-w-md mx-auto text-center py-20 px-4 animate-in fade-in duration-300">
				<div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20 text-red-500 mb-6">
					<Heart className="h-10 w-10 text-red-500 fill-red-500/10" />
				</div>
				<h1 className="text-2xl font-bold tracking-tight mb-2">
					Aucun produit favori
				</h1>
				<p className="text-muted-foreground text-sm mb-8">
					Parcourez nos produits et ajoutez vos articles préférés dans votre liste de souhaits.
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
		<div className="pb-16 animate-in fade-in duration-300">
			<h1 className="text-3xl font-bold tracking-tight mb-8 font-heading">
				Mes Favoris ({wishlistCount} {wishlistCount > 1 ? "articles" : "article"})
			</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{wishlistItems.map((product) => {
					const rating = product.rating || { rate: 0, count: 0 };
					return (
						<Card
							key={product.id}
							className="h-full flex flex-col overflow-hidden border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl group relative"
						>
							{/* Delete Heart Button Overlay */}
							<button
								onClick={() => toggleWishlist(product)}
								className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 shadow-md backdrop-blur border border-border/40 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 text-muted-foreground transition-all duration-200 cursor-pointer"
								title="Supprimer des favoris"
							>
								<Trash2 className="h-4 w-4" />
							</button>

							{/* Image Container */}
							<Link href={`/products/${product.id}`} className="block">
								<div className="bg-white p-6 aspect-[4/3] flex items-center justify-center relative overflow-hidden border-b border-border">
									<img
										src={product.image}
										alt={product.title}
										className="h-full max-h-[140px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
										loading="lazy"
									/>
								</div>
							</Link>

							{/* Card Body */}
							<CardHeader className="flex-1 p-5 space-y-2 pb-3">
								<div className="flex items-center justify-between gap-2">
									<Badge
										variant="outline"
										className="capitalize text-[10px] px-2 py-0.5 font-semibold bg-secondary/30 text-secondary-foreground border-secondary/50"
									>
										{product.category}
									</Badge>

									{/* Rating */}
									{rating.count > 0 && (
										<div className="flex items-center gap-0.5 text-xs">
											<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
											<span className="font-semibold text-foreground">
												{rating.rate.toFixed(1)}
											</span>
										</div>
									)}
								</div>

								<Link href={`/products/${product.id}`} className="block group-hover:text-primary transition-colors">
									<CardTitle className="line-clamp-2 text-sm font-bold leading-snug min-h-[40px]">
										{product.title}
									</CardTitle>
								</Link>
							</CardHeader>

							{/* Card Footer: Price & CTA */}
							<CardFooter className="p-5 pt-0 flex flex-col gap-3">
								<div className="w-full flex items-center justify-between">
									<span className="text-base font-extrabold text-foreground">
										{product.price.toFixed(2)} €
									</span>
								</div>
								<Button
									onClick={() => addToCart(product, 1)}
									className="w-full font-semibold text-xs py-2 cursor-pointer"
									size="sm"
								>
									<ShoppingCart className="h-3.5 w-3.5 mr-2" />
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
