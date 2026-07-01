"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Trash2,
	Plus,
	Minus,
	ShoppingBag,
	CheckCircle2,
	ArrowRight,
	Loader2,
	ShoppingBagIcon,
} from "lucide-react";

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
		return (
			<div className="max-w-2xl mx-auto text-center py-16 px-4 animate-in fade-in duration-300">
				<div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 mb-6">
					<CheckCircle2 className="h-10 w-10" />
				</div>
				<h1 className="text-3xl font-bold tracking-tight mb-2">
					Commande validée !
				</h1>
				<p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
					Votre commande a été traitée avec succès. FakeStoreAPI a simulé la transaction avec succès.
				</p>

				<Card className="border-emerald-100 dark:border-emerald-950 bg-card mb-8">
					<CardContent className="p-6 space-y-4">
						<div className="flex justify-between text-sm text-muted-foreground">
							<span>Numéro de commande</span>
							<span className="font-semibold text-foreground">
								#{orderResult.id} (Simulé)
							</span>
						</div>
						<div className="flex justify-between text-sm text-muted-foreground">
							<span>Date</span>
							<span>{new Date(orderResult.date).toLocaleDateString("fr-FR")}</span>
						</div>
						<Separator />
						<div className="space-y-2">
							<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block text-left">
								Articles commandés
							</span>
							<div className="divide-y divide-border">
								{orderResult.items.map((item: any) => (
									<div
										key={item.product.id}
										className="flex justify-between items-center py-2 text-sm"
									>
										<span className="truncate max-w-[320px]">
											{item.product.title}{" "}
											<span className="text-muted-foreground text-xs font-normal">
												(x{item.quantity})
											</span>
										</span>
										<span className="font-medium shrink-0">
											{(item.product.price * item.quantity).toFixed(2)} €
										</span>
									</div>
								))}
							</div>
						</div>
						<Separator />
						<div className="flex justify-between text-base font-bold text-foreground">
							<span>Total réglé</span>
							<span>{orderResult.total.toFixed(2)} €</span>
						</div>
					</CardContent>
				</Card>

				<div className="flex flex-col sm:flex-row justify-center gap-4">
					<Button asChild size="lg" className="font-semibold">
						<Link href="/products">Continuer mes achats</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/">Retour à l'accueil</Link>
					</Button>
				</div>
			</div>
		);
	}

	// EMPTY CART SCREEN
	if (cartItems.length === 0) {
		return (
			<div className="max-w-md mx-auto text-center py-20 px-4 animate-in fade-in duration-300">
				<div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground mb-6">
					<ShoppingBagIcon className="h-10 w-10" />
				</div>
				<h1 className="text-2xl font-bold tracking-tight mb-2">
					Votre panier est vide
				</h1>
				<p className="text-muted-foreground text-sm mb-8">
					Découvrez nos produits exceptionnels et commencez à remplir votre panier dès maintenant.
				</p>
				<Button asChild size="lg" className="font-semibold">
					<Link href="/products">
						Découvrir nos produits <ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
		);
	}

	// CART LIST SCREEN
	return (
		<div className="pb-16 animate-in fade-in duration-300">
			<h1 className="text-3xl font-bold tracking-tight mb-8 font-heading">
				Mon Panier ({cartCount} {cartCount > 1 ? "articles" : "article"})
			</h1>

			<div className="grid gap-8 lg:grid-cols-12">
				{/* List of Cart Items */}
				<div className="lg:col-span-8 space-y-4">
					{cartItems.map((item) => (
						<Card key={item.product.id} className="overflow-hidden border-border bg-card">
							<CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
								{/* Thumbnail */}
								<div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white p-2 border border-border flex items-center justify-center">
									<img
										src={item.product.image}
										alt={item.product.title}
										className="h-full w-full object-contain"
									/>
								</div>

								{/* Info */}
								<div className="flex-1 min-w-0 w-full">
									<div className="flex items-start justify-between gap-4">
										<div>
											<Link
												href={`/products/${item.product.id}`}
												className="font-semibold text-base text-foreground hover:text-primary transition-colors hover:underline line-clamp-2"
											>
												{item.product.title}
											</Link>
											<p className="text-xs text-muted-foreground capitalize mt-1">
												{item.product.category}
											</p>
										</div>

										<button
											onClick={() => removeFromCart(item.product.id)}
											className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
											title="Supprimer l'article"
										>
											<Trash2 className="h-4.5 w-4.5" />
										</button>
									</div>

									{/* Controls & Price */}
									<div className="flex items-center justify-between mt-4">
										{/* Quantity Picker */}
										<div className="flex items-center rounded-lg border border-border bg-card p-1">
											<button
												onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
												className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
												type="button"
												aria-label="Diminuer"
											>
												<Minus className="h-3.5 w-3.5" />
											</button>
											<span className="w-8 text-center text-xs font-semibold text-foreground select-none">
												{item.quantity}
											</span>
											<button
												onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
												className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
					))}

					{/* Actions row */}
					<div className="flex justify-between items-center pt-2">
						<Button asChild variant="ghost" size="sm">
							<Link href="/products" className="text-xs">
								← Continuer mes achats
							</Link>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={clearCart}
							className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
						>
							Vider le panier
						</Button>
					</div>
				</div>

				{/* Order Summary Sidebar */}
				<div className="lg:col-span-4">
					<Card className="border-border bg-card sticky top-24">
						<CardContent className="p-6 space-y-6">
							<h2 className="text-lg font-bold text-foreground">
								Résumé de la commande
							</h2>

							<div className="space-y-4 text-sm">
								<div className="flex justify-between text-muted-foreground">
									<span>Sous-total</span>
									<span className="font-medium text-foreground">
										{cartTotal.toFixed(2)} €
									</span>
								</div>
								<div className="flex justify-between text-muted-foreground">
									<span>Livraison</span>
									<span className="font-medium text-emerald-500">Gratuit</span>
								</div>
								<div className="flex justify-between text-muted-foreground">
									<span>TVA (20%)</span>
									<span>
										{(cartTotal - cartTotal / 1.2).toFixed(2)} €
									</span>
								</div>

								<Separator />

								<div className="flex justify-between text-base font-bold text-foreground">
									<span>Total</span>
									<span>{cartTotal.toFixed(2)} €</span>
								</div>
							</div>

							<Button
								className="w-full font-semibold py-6"
								onClick={handleCheckout}
								disabled={isOrdering}
							>
								{isOrdering ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Traitement en cours...
									</>
								) : (
									"Passer la commande"
								)}
							</Button>

							<p className="text-[10px] text-muted-foreground text-center leading-normal">
								En validant votre commande, vous acceptez nos conditions générales de vente. Simulation d'API réalisée sur fakestoreapi.com.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
