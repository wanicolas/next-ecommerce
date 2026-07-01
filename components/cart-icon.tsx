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
			className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			aria-label="Panier"
		>
			<ShoppingCart className="h-5 w-5" />
			{cartCount > 0 && (
				<span className="absolute -top-1 -right-1 flex h-5 w-5 animate-in items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground duration-200 zoom-in-50">
					{cartCount}
				</span>
			)}
		</Link>
	);
}
