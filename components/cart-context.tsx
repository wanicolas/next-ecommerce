"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";

export interface CartItem {
	product: {
		id: number;
		title: string;
		price: number;
		description: string;
		category: string;
		image: string;
	};
	quantity: number;
}

interface ToastState {
	id: number;
	title: string;
	message: string;
	image?: string;
	visible: boolean;
}

interface CartContextType {
	/** Liste des produits actuellement dans le panier avec leur quantité. */
	cartItems: CartItem[];
	/** Ajoute un produit au panier ou incrémente sa quantité s'il existe déjà. */
	addToCart: (product: CartItem["product"], quantity?: number) => void;
	/** Retire un produit du panier en fonction de son identifiant. */
	removeFromCart: (productId: number) => void;
	/** Met à jour la quantité d'un produit spécifique dans le panier. */
	updateQuantity: (productId: number, quantity: number) => void;
	/** Vide l'intégralité du panier de l'utilisateur. */
	clearCart: () => void;
	/** Nombre total d'articles dans le panier. */
	cartCount: number;
	/** Montant total de la commande en Euros. */
	cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Fournisseur de contexte global pour le panier (Cart).
 * Synchronise l'état avec le localStorage du navigateur et gère une notification Toast animée à l'ajout.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [toast, setToast] = useState<ToastState | null>(null);

	// Load cart from localStorage on mount
	useEffect(() => {
		try {
			const savedCart = localStorage.getItem("next_ecommerce_cart");
			if (savedCart) {
				const parsed = JSON.parse(savedCart);
				setTimeout(() => {
					setCartItems(parsed);
					setIsLoaded(true);
				}, 0);
				return;
			}
		} catch (error) {
			console.error("Failed to load cart from localStorage", error);
		}
		setTimeout(() => setIsLoaded(true), 0);
	}, []);

	// Sync cart to localStorage whenever it changes (after initial load)
	useEffect(() => {
		if (!isLoaded) return;
		try {
			localStorage.setItem("next_ecommerce_cart", JSON.stringify(cartItems));
		} catch (error) {
			console.error("Failed to save cart to localStorage", error);
		}
	}, [cartItems, isLoaded]);

	const showToast = (title: string, message: string, image?: string) => {
		const id = Date.now();
		setToast({ id, title, message, image, visible: true });

		// Auto hide toast after 4 seconds
		setTimeout(() => {
			setToast((prev) =>
				prev && prev.id === id ? { ...prev, visible: false } : prev
			);
		}, 4000);
	};

	const addToCart = (product: CartItem["product"], quantity = 1) => {
		setCartItems((prevItems) => {
			const existingItemIndex = prevItems.findIndex(
				(item) => item.product.id === product.id
			);

			if (existingItemIndex > -1) {
				// Product exists, increment quantity
				const newItems = [...prevItems];
				newItems[existingItemIndex].quantity += quantity;
				return newItems;
			} else {
				// New product
				return [...prevItems, { product, quantity }];
			}
		});

		showToast(
			"Ajouté au panier !",
			`${product.title} (x${quantity})`,
			product.image
		);
	};

	const removeFromCart = (productId: number) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item.product.id !== productId)
		);
	};

	const updateQuantity = (productId: number, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(productId);
			return;
		}

		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.product.id === productId ? { ...item, quantity } : item
			)
		);
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
	const cartTotal = cartItems.reduce(
		(acc, item) => acc + item.product.price * item.quantity,
		0
	);

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				cartCount,
				cartTotal,
			}}
		>
			{children}

			{/* Custom Animated Toast Notification */}
			{toast && (
				<div
					className={`fixed right-4 bottom-4 z-50 w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all duration-300 md:right-6 md:bottom-6 ${
						toast.visible
							? "translate-y-0 scale-100 animate-in opacity-100 slide-in-from-bottom-5 fade-in"
							: "pointer-events-none translate-y-4 scale-95 opacity-0 transition-all duration-200"
					}`}
				>
					<div className="p-4">
						<div className="flex items-start gap-3">
							{toast.image ? (
								<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1">
									<Image
										src={toast.image}
										alt=""
										width={48}
										height={48}
										className="h-full w-full object-contain"
									/>
								</div>
							) : (
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<ShoppingBag className="h-6 w-6" />
								</div>
							)}
							<div className="flex-1 space-y-1">
								<p className="text-sm font-semibold text-foreground">
									{toast.title}
								</p>
								<p className="line-clamp-1 text-xs text-muted-foreground">
									{toast.message}
								</p>
								<Link
									href="/panier"
									className="inline-block text-xs font-semibold text-primary hover:underline"
									onClick={() =>
										setToast((prev) =>
											prev ? { ...prev, visible: false } : null
										)
									}
								>
									Voir le panier →
								</Link>
							</div>
							<button
								onClick={() =>
									setToast((prev) =>
										prev ? { ...prev, visible: false } : null
									)
								}
								className="cursor-pointer rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			)}
		</CartContext.Provider>
	);
}

/**
 * Hook personnalisé pour interagir avec l'état global du panier.
 * Doit impérativement être utilisé au sein d'un composant enveloppé par `CartProvider`.
 */
export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
