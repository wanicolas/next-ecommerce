"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useWishlist, WishlistItem } from "./wishlist-context";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
	product: WishlistItem;
	className?: string;
}

export function WishlistButton({ product, className }: WishlistButtonProps) {
	const { toggleWishlist, isInWishlist } = useWishlist();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const handleToggle = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		toggleWishlist(product);
	};

	const active = mounted && isInWishlist(product.id);

	return (
		<button
			onClick={handleToggle}
			className={cn(
				"relative flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 shadow-md backdrop-blur border border-border/40 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer group/wishlist active:scale-95",
				className
			)}
			title={active ? "Retirer des favoris" : "Ajouter aux favoris"}
			type="button"
		>
			<Heart
				className={cn(
					"h-4 w-4 transition-all duration-300",
					active
						? "fill-red-500 text-red-500 scale-110 animate-in zoom-in-75 duration-200"
						: "text-muted-foreground group-hover/wishlist:text-red-500 group-hover/wishlist:scale-105"
				)}
			/>
		</button>
	);
}
