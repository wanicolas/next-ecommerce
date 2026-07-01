"use client";

import * as React from "react";
import { useState } from "react";
import { useCart, CartItem } from "@/components/cart-context";
import { useWishlist } from "@/components/wishlist-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Loader2, Heart } from "lucide-react";

interface ProductActionsProps {
	product: CartItem["product"];
}

export function ProductActions({ product }: ProductActionsProps) {
	const { addToCart } = useCart();
	const [quantity, setQuantity] = useState(1);
	const [isAdding, setIsAdding] = useState(false);

	const handleDecrease = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const handleIncrease = () => {
		// Mock max stock limit of 10
		if (quantity < 10) {
			setQuantity(quantity + 1);
		}
	};

	const handleAdd = () => {
		setIsAdding(true);
		// Simulate network delay to make the UX feel premium and real
		setTimeout(() => {
			addToCart(product, quantity);
			setIsAdding(false);
		}, 600);
	};

	const { toggleWishlist, isInWishlist } = useWishlist();

	return (
		<div className="flex flex-col gap-4">
			{/* Quantity Selector & Stock Scarcity */}
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<span className="text-sm font-medium text-muted-foreground">
						Quantité
					</span>
					<div className="flex items-center rounded-lg border border-border bg-card p-1">
						<button
							onClick={handleDecrease}
							disabled={quantity <= 1 || isAdding}
							className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
							type="button"
							aria-label="Diminuer la quantité"
						>
							<Minus className="h-4 w-4" />
						</button>
						<span className="w-10 text-center text-sm font-semibold text-foreground select-none">
							{quantity}
						</span>
						<button
							onClick={handleIncrease}
							disabled={quantity >= 10 || isAdding}
							className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
							type="button"
							aria-label="Augmenter la quantité"
						>
							<Plus className="h-4 w-4" />
						</button>
					</div>
					{quantity >= 10 && (
						<span className="text-xs font-medium text-amber-500">
							Limite maximale atteinte (10)
						</span>
					)}
				</div>
				<p className="text-xs text-muted-foreground">
					Plus que{" "}
					<span className="font-semibold text-foreground">6 articles</span> en
					stock - Expédition sous 24h
				</p>
			</div>

			{/* Add to Cart & Wishlist Buttons */}
			<div className="flex gap-3">
				<Button
					size="lg"
					className="flex-1 cursor-pointer font-semibold transition-all duration-200"
					onClick={handleAdd}
					disabled={isAdding}
				>
					{isAdding ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Ajout en cours...
						</>
					) : (
						<>
							<ShoppingBag className="mr-2 h-4 w-4" />
							Ajouter au panier
						</>
					)}
				</Button>

				<Button
					variant="outline"
					size="lg"
					className="shrink-0 cursor-pointer px-4 transition-colors hover:border-red-200 hover:text-red-500 dark:hover:border-red-950"
					onClick={() => toggleWishlist(product)}
					aria-label={
						isInWishlist(product.id)
							? "Retirer des favoris"
							: "Ajouter aux favoris"
					}
				>
					<Heart
						className={`h-5 w-5 transition-transform active:scale-90 ${
							isInWishlist(product.id)
								? "fill-red-500 text-red-500"
								: "text-muted-foreground"
						}`}
					/>
				</Button>
			</div>
		</div>
	);
}
