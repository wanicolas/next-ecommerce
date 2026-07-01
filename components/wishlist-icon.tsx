"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "./wishlist-context";

export function WishlistIcon() {
	const { wishlistCount } = useWishlist();

	return (
		<Link
			href="/favoris"
			className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			aria-label="Favoris"
		>
			<Heart className="h-5 w-5" />
			{wishlistCount > 0 && (
				<span className="absolute -top-1 -right-1 flex h-5 w-5 animate-in items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white duration-200 zoom-in-50">
					{wishlistCount}
				</span>
			)}
		</Link>
	);
}
