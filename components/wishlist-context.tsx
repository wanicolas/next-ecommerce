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
	/** Liste des produits présents dans les favoris. */
	wishlistItems: WishlistItem[];
	/** Ajoute ou retire un produit de la liste des favoris. */
	toggleWishlist: (product: WishlistItem) => void;
	/** Vérifie si un produit spécifique est dans les favoris. */
	isInWishlist: (productId: number) => boolean;
	/** Nombre total d'articles favoris. */
	wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
	undefined
);

/**
 * Fournisseur de contexte global pour la liste de favoris (Wishlist).
 * Persiste les favoris dans le localStorage du navigateur avec protection d'hydratation.
 */
export function WishlistProvider({ children }: { children: React.ReactNode }) {
	const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load wishlist from localStorage on mount
	useEffect(() => {
		try {
			const savedWishlist = localStorage.getItem("next_ecommerce_wishlist");
			if (savedWishlist) {
				const parsed = JSON.parse(savedWishlist);
				setTimeout(() => {
					setWishlistItems(parsed);
					setIsLoaded(true);
				}, 0);
				return;
			}
		} catch (error) {
			console.error("Failed to load wishlist from localStorage", error);
		}
		setTimeout(() => setIsLoaded(true), 0);
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

/**
 * Hook personnalisé pour interagir avec l'état de la liste de favoris (Ajout/Retrait, vérification d'état).
 * Doit impérativement être utilisé au sein d'un composant enveloppé par un `WishlistProvider`.
 */
export function useWishlist() {
	const context = useContext(WishlistContext);
	if (context === undefined) {
		throw new Error("useWishlist must be used within a WishlistProvider");
	}
	return context;
}
