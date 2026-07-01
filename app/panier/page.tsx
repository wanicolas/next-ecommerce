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
			<div className="mx-auto max-w-2xl animate-in px-4 py-16 text-center duration-300 fade-in">
				<div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
					<CheckCircle2 className="h-10 w-10" />
				</div>
				<h1 className="mb-2 text-3xl font-bold tracking-tight">
					Commande validée !
				</h1>
				<p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground">
					Votre commande a été traitée avec succès. FakeStoreAPI a simulé la
					transaction avec succès.
				</p>

				<Card className="mb-8 border-emerald-100 bg-card dark:border-emerald-950">
					<CardContent className="space-y-4 p-6">
						<div className="flex justify-between text-sm text-muted-foreground">
							<span>Numéro de commande</span>
							<span className="font-semibold text-foreground">
								#{orderResult.id} (Simulé)
							</span>
						</div>
						<div className="flex justify-between text-sm text-muted-foreground">
							<span>Date</span>
							<span>
								{new Date(orderResult.date).toLocaleDateString("fr-FR")}
							</span>
						</div>
						<Separator />
						<div className="space-y-2">
							<span className="block text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
								Articles commandés
							</span>
							<div className="divide-y divide-border">
								{orderResult.items.map((item: any) => (
									<div
										key={item.product.id}
										className="flex items-center justify-between py-2 text-sm"
									>
										<span className="max-w-[320px] truncate">
											{item.product.title}{" "}
											<span className="text-xs font-normal text-muted-foreground">
												(x{item.quantity})
											</span>
										</span>
										<span className="shrink-0 font-medium">
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

				<div className="flex flex-col justify-center gap-4 sm:flex-row">
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
		<div className="animate-in pb-16 duration-300 fade-in">
			<h1 className="mb-8 font-heading text-3xl font-bold tracking-tight">
				Mon Panier ({cartCount} {cartCount > 1 ? "articles" : "article"})
			</h1>

			<div className="grid gap-8 lg:grid-cols-12">
				{/* List of Cart Items */}
				<div className="space-y-4 lg:col-span-8">
					{cartItems.map((item) => (
						<Card
							key={item.product.id}
							className="overflow-hidden border-border bg-card"
						>
							<CardContent className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
								{/* Thumbnail */}
								<div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-2">
									<img
										src={item.product.image}
										alt={item.product.title}
										className="h-full w-full object-contain"
									/>
								</div>

								{/* Info */}
								<div className="w-full min-w-0 flex-1">
									<div className="flex items-start justify-between gap-4">
										<div>
											<Link
												href={`/products/${item.product.id}`}
												className="line-clamp-2 text-base font-semibold text-foreground transition-colors hover:text-primary hover:underline"
											>
												{item.product.title}
											</Link>
											<p className="mt-1 text-xs text-muted-foreground capitalize">
												{item.product.category}
											</p>
										</div>

										<button
											onClick={() => removeFromCart(item.product.id)}
											className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
											title="Supprimer l'article"
										>
											<Trash2 className="h-4.5 w-4.5" />
										</button>
									</div>

									{/* Controls & Price */}
									<div className="mt-4 flex items-center justify-between">
										{/* Quantity Picker */}
										<div className="flex items-center rounded-lg border border-border bg-card p-1">
											<button
												onClick={() =>
													updateQuantity(item.product.id, item.quantity - 1)
												}
												className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
												type="button"
												aria-label="Diminuer"
											>
												<Minus className="h-3.5 w-3.5" />
											</button>
											<span className="w-8 text-center text-xs font-semibold text-foreground select-none">
												{item.quantity}
											</span>
											<button
												onClick={() =>
													updateQuantity(item.product.id, item.quantity + 1)
												}
												className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
					<div className="flex items-center justify-between pt-2">
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
					<Card className="sticky top-24 border-border bg-card">
						<CardContent className="space-y-6 p-6">
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
									<span>{(cartTotal - cartTotal / 1.2).toFixed(2)} €</span>
								</div>

								<Separator />

								<div className="flex justify-between text-base font-bold text-foreground">
									<span>Total</span>
									<span>{cartTotal.toFixed(2)} €</span>
								</div>
							</div>

							<Button
								className="w-full py-6 font-semibold"
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

							<p className="text-center text-[10px] leading-normal text-muted-foreground">
								En validant votre commande, vous acceptez nos conditions
								générales de vente. Simulation d'API réalisée sur
								fakestoreapi.com.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
