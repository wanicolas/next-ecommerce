"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CartSummaryProps {
	cartTotal: number;
	onCheckout: () => void;
	isOrdering: boolean;
}

export function CartSummary({
	cartTotal,
	onCheckout,
	isOrdering,
}: CartSummaryProps) {
	const tva = cartTotal - cartTotal / 1.2;

	return (
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
							<span>{tva.toFixed(2)} €</span>
						</div>

						<Separator />

						<div className="flex justify-between text-base font-bold text-foreground">
							<span>Total</span>
							<span>{cartTotal.toFixed(2)} €</span>
						</div>
					</div>

					<Button
						className="w-full cursor-pointer py-6 font-semibold"
						onClick={onCheckout}
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
						En validant votre commande, vous acceptez nos conditions générales
						de vente. Simulation d&apos;API réalisée sur fakestoreapi.com.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
