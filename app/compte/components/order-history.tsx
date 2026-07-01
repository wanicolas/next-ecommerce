"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Loader2, ShoppingBag } from "lucide-react";

interface OrderHistoryProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	orders: any[];
	isLoading: boolean;
}

export function OrderHistory({ orders, isLoading }: OrderHistoryProps) {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 border-b border-border pb-4">
				<Package className="h-6 w-6 text-primary" />
				<h2 className="font-heading text-2xl font-bold tracking-tight">
					Historique des Commandes
				</h2>
			</div>

			{isLoading ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-16 text-center">
					<Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
					<p className="text-sm font-medium text-muted-foreground">
						Chargement de votre historique de commandes...
					</p>
				</div>
			) : orders.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-16 text-center">
					<ShoppingBag className="mb-4 h-10 w-10 text-muted-foreground" />
					<h3 className="text-base font-bold text-foreground">
						Aucune commande passée
					</h3>
					<p className="mt-1 max-w-xs text-sm text-muted-foreground">
						Vous n&apos;avez pas encore effectué d&apos;achats avec ce compte.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{orders.map((order) => (
						<Card
							key={order.id}
							className="overflow-hidden border-border bg-card transition-all hover:shadow-md"
						>
							{/* Order Card Header */}
							<div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-muted/40 px-6 py-4">
								<div className="flex items-center gap-6">
									<div>
										<span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
											Numéro de commande
										</span>
										<span className="text-sm font-bold text-foreground">
											#{order.id}
										</span>
									</div>
									<div>
										<span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
											Date d&apos;achat
										</span>
										<span className="text-sm font-medium text-foreground">
											{new Date(order.date).toLocaleDateString("fr-FR")}
										</span>
									</div>
								</div>
								<div className="ml-auto flex items-center gap-6 text-right">
									<div>
										<span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
											Montant Total
										</span>
										<span className="text-sm font-extrabold text-foreground">
											{order.total.toFixed(2)} €
										</span>
									</div>
									<div>
										<Badge
											variant="outline"
											className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 uppercase dark:border-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-400"
										>
											Livré
										</Badge>
									</div>
								</div>
							</div>

							{/* Order Card Items List */}
							<CardContent className="divide-y divide-border p-6">
								{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
								{order.items.map((item: any) => (
									<div
										key={item.productId}
										className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
									>
										{item.product.image ? (
											<Link
												href={`/products/${item.productId}`}
												className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1 transition-opacity hover:opacity-95"
											>
												<Image
													src={item.product.image}
													alt={item.product.title || ""}
													width={48}
													height={48}
													className="h-full w-full object-contain"
												/>
											</Link>
										) : (
											<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted">
												<ShoppingBag className="h-6 w-6 text-muted-foreground" />
											</div>
										)}

										<div className="min-w-0 flex-1">
											<Link
												href={`/products/${item.productId}`}
												className="block truncate text-sm font-bold text-foreground transition-colors hover:text-primary hover:underline"
											>
												{item.product.title}
											</Link>
											<span className="mt-1 block text-xs text-muted-foreground">
												Quantité : {item.quantity} ×{" "}
												{item.product.price.toFixed(2)} €
											</span>
										</div>

										<span className="shrink-0 pl-4 text-sm font-bold text-foreground">
											{(item.product.price * item.quantity).toFixed(2)} €
										</span>
									</div>
								))}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
