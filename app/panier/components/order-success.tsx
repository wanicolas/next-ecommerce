"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface OrderSuccessProps {
	orderResult: {
		id: number;
		userId: number;
		date: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		items: any[];
		total: number;
	};
}

export function OrderSuccess({ orderResult }: OrderSuccessProps) {
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
							{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
							{orderResult.items.map((item: any) => (
								<div
									key={item.product.id}
									className="flex items-center justify-between py-2 text-sm"
								>
									<span className="block max-w-[320px] truncate text-left">
										{item.product.title}{" "}
										<span className="text-xs font-normal text-muted-foreground">
											(x{item.quantity})
										</span>
									</span>
									<span className="ml-4 shrink-0 font-medium">
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
				<Button asChild size="lg" className="cursor-pointer font-semibold">
					<Link href="/products">Continuer mes achats</Link>
				</Button>
				<Button asChild variant="outline" size="lg" className="cursor-pointer">
					<Link href="/">Retour à l&apos;accueil</Link>
				</Button>
			</div>
		</div>
	);
}
