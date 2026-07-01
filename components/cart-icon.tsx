"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-context";

export function CartIcon() {
	const { cartCount } = useCart();

	return (
		<Link
			href="/panier"
			className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
			aria-label="Panier"
		>
			<ShoppingCart className="h-5 w-5" />
			{cartCount > 0 && (
				<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in-50 duration-200">
					{cartCount}
				</span>
			)}
		</Link>
	);
}
