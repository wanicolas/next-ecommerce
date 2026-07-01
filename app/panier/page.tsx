"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingBag as ShoppingBagIcon, ArrowRight } from "lucide-react";

import { OrderSuccess } from "./components/order-success";
import { CartItemRow } from "./components/cart-item-row";
import { CartSummary } from "./components/cart-summary";

export default function CartPage() {
	const {
		cartItems,
		updateQuantity,
		removeFromCart,
		clearCart,
		cartTotal,
		cartCount,
	} = useCart();

	const [isOrdering, setIsOrdering] = useState(false);
	const [orderResult, setOrderResult] = useState<any>(null);

	const handleCheckout = async () => {
		if (cartItems.length === 0) return;

		setIsOrdering(true);
		try {
			// Simulate order creation using FakeStoreAPI Cart POST endpoint
			const response = await fetch("https://fakestoreapi.com/carts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: 1, // Mock user id
					date: new Date().toISOString().substring(0, 10),
					products: cartItems.map((item) => ({
						productId: item.product.id,
						quantity: item.quantity,
					})),
				}),
			});

			if (!response.ok) {
				throw new Error("Erreur serveur lors de la commande.");
			}

			const data = await response.json();
			// Set simulated order details to display success screen
			setOrderResult({
				id: data.id,
				userId: data.userId,
				date: data.date,
				items: [...cartItems],
				total: cartTotal,
			});

			// Empty local cart
			clearCart();
		} catch (error) {
			console.error("Failed to checkout", error);
			alert("Une erreur s'est produite lors de la validation de la commande.");
		} finally {
			setIsOrdering(false);
		}
	};

	// SUCCESS ORDER SCREEN
	if (orderResult) {
		return <OrderSuccess orderResult={orderResult} />;
	}

	// EMPTY CART SCREEN
	if (cartItems.length === 0) {
		return (
			<div className="mx-auto max-w-md animate-in px-4 py-20 text-center duration-300 fade-in">
				<div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
					<ShoppingBagIcon className="h-10 w-10" />
				</div>
				<h1 className="mb-2 text-2xl font-bold tracking-tight">
					Votre panier est vide
				</h1>
				<p className="mb-8 text-sm text-muted-foreground">
					Découvrez nos produits exceptionnels et commencez à remplir votre
					panier dès maintenant.
				</p>
				<Button asChild size="lg" className="cursor-pointer font-semibold">
					<Link href="/products">
						Découvrir nos produits <ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
		);
	}

	// CART LIST SCREEN
	return (
		<div className="animate-in pb-16 duration-300 fade-in">
			<h1 className="mb-8 font-heading text-3xl font-bold tracking-tight">
				Mon Panier ({cartCount} {cartCount > 1 ? "articles" : "article"})
			</h1>

			<div className="grid gap-8 lg:grid-cols-12">
				{/* List of Cart Items */}
				<div className="space-y-4 lg:col-span-8">
					{cartItems.map((item) => (
						<CartItemRow
							key={item.product.id}
							item={item}
							onUpdateQuantity={updateQuantity}
							onRemove={removeFromCart}
						/>
					))}

					{/* Actions row */}
					<div className="flex items-center justify-between pt-2">
						<Button
							asChild
							variant="ghost"
							size="sm"
							className="cursor-pointer"
						>
							<Link href="/products" className="text-xs">
								← Continuer mes achats
							</Link>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={clearCart}
							className="cursor-pointer text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
						>
							Vider le panier
						</Button>
					</div>
				</div>

				{/* Order Summary Sidebar */}
				<CartSummary
					cartTotal={cartTotal}
					onCheckout={handleCheckout}
					isOrdering={isOrdering}
				/>
			</div>
		</div>
	);
}
