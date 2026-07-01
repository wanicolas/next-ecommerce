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
				"group/wishlist relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border/40 bg-white/80 shadow-md backdrop-blur transition-all duration-200 hover:bg-white active:scale-95 dark:bg-zinc-900/80 dark:hover:bg-zinc-900",
				className
			)}
			title={active ? "Retirer des favoris" : "Ajouter aux favoris"}
			type="button"
		>
			<Heart
				className={cn(
					"h-4 w-4 transition-all duration-300",
					active
						? "scale-110 animate-in fill-red-500 text-red-500 duration-200 zoom-in-75"
						: "text-muted-foreground group-hover/wishlist:scale-105 group-hover/wishlist:text-red-500"
				)}
			/>
		</button>
	);
}
