"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem } from "@/components/cart-context";

interface CartItemRowProps {
	item: CartItem;
	onUpdateQuantity: (productId: number, quantity: number) => void;
	onRemove: (productId: number) => void;
}

export function CartItemRow({
	item,
	onUpdateQuantity,
	onRemove,
}: CartItemRowProps) {
	return (
		<Card className="overflow-hidden border-border bg-card">
			<CardContent className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
				{/* Thumbnail */}
				<div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-2">
					<Image
						src={item.product.image}
						alt={item.product.title}
						width={96}
						height={96}
						className="h-full w-full object-contain"
					/>
				</div>

				{/* Info */}
				<div className="w-full min-w-0 flex-1">
					<div className="flex items-start justify-between gap-4">
						<div>
							<Link
								href={`/products/${item.product.id}`}
								className="line-clamp-2 text-base font-semibold text-foreground transition-colors hover:text-primary hover:underline"
							>
								{item.product.title}
							</Link>
							<p className="mt-1 text-xs text-muted-foreground capitalize">
								{item.product.category}
							</p>
						</div>

						<button
							onClick={() => onRemove(item.product.id)}
							className="shrink-0 cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
							title="Supprimer l'article"
						>
							<Trash2 className="h-4.5 w-4.5" />
						</button>
					</div>

					{/* Controls & Price */}
					<div className="mt-4 flex items-center justify-between">
						{/* Quantity Picker */}
						<div className="flex items-center rounded-lg border border-border bg-card p-1">
							<button
								onClick={() =>
									onUpdateQuantity(item.product.id, item.quantity - 1)
								}
								className="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								type="button"
								aria-label="Diminuer"
							>
								<Minus className="h-3.5 w-3.5" />
							</button>
							<span className="w-8 text-center text-xs font-semibold text-foreground select-none">
								{item.quantity}
							</span>
							<button
								onClick={() =>
									onUpdateQuantity(item.product.id, item.quantity + 1)
								}
								className="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								type="button"
								aria-label="Augmenter"
							>
								<Plus className="h-3.5 w-3.5" />
							</button>
						</div>

						{/* Total Price for item */}
						<div className="text-right">
							<p className="text-base font-bold text-foreground">
								{(item.product.price * item.quantity).toFixed(2)} €
							</p>
							{item.quantity > 1 && (
								<p className="text-xs text-muted-foreground">
									{item.product.price.toFixed(2)} € / unité
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
