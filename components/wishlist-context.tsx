"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export interface WishlistItem {
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
}

interface WishlistContextType {
	wishlistItems: WishlistItem[];
	toggleWishlist: (product: WishlistItem) => void;
	isInWishlist: (productId: number) => boolean;
	wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
	undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
	const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load wishlist from localStorage on mount
	useEffect(() => {
		try {
			const savedWishlist = localStorage.getItem("next_ecommerce_wishlist");
			if (savedWishlist) {
				setWishlistItems(JSON.parse(savedWishlist));
			}
		} catch (error) {
			console.error("Failed to load wishlist from localStorage", error);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	// Sync wishlist to localStorage
	useEffect(() => {
		if (!isLoaded) return;
		try {
			localStorage.setItem(
				"next_ecommerce_wishlist",
				JSON.stringify(wishlistItems)
			);
		} catch (error) {
			console.error("Failed to save wishlist to localStorage", error);
		}
	}, [wishlistItems, isLoaded]);

	const toggleWishlist = (product: WishlistItem) => {
		setWishlistItems((prev) => {
			const exists = prev.some((item) => item.id === product.id);
			if (exists) {
				return prev.filter((item) => item.id !== product.id);
			} else {
				return [...prev, product];
			}
		});
	};

	const isInWishlist = (productId: number) => {
		return wishlistItems.some((item) => item.id === productId);
	};

	const wishlistCount = wishlistItems.length;

	return (
		<WishlistContext.Provider
			value={{
				wishlistItems,
				toggleWishlist,
				isInWishlist,
				wishlistCount,
			}}
		>
			{children}
		</WishlistContext.Provider>
	);
}

export function useWishlist() {
	const context = useContext(WishlistContext);
	if (context === undefined) {
		throw new Error("useWishlist must be used within a WishlistProvider");
	}
	return context;
}
