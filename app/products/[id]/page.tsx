import * as React from "react";
import Link from "next/link";
import {
	ArrowLeft,
	Star,
	StarHalf,
	Truck,
	ShieldCheck,
	Lock,
	ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductActions } from "./product-actions";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const response = await fetch("https://fakestoreapi.com/products/" + id);
	if (!response.ok) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<h2 className="text-2xl font-bold">Produit introuvable</h2>
				<p className="mt-2 text-muted-foreground">
					Désolé, ce produit n'existe pas ou a été retiré de notre catalogue.
				</p>
				<Link
					href="/products"
					className="mt-6 flex items-center gap-2 text-primary hover:underline"
				>
					<ArrowLeft className="h-4 w-4" /> Retour aux produits
				</Link>
			</div>
		);
	}

	const product: {
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
	} = await response.json();

	// Calculate rating stars
	const rating = product.rating || { rate: 0, count: 0 };
	const fullStars = Math.floor(rating.rate);
	const hasHalfStar = rating.rate % 1 >= 0.5;
	const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

	return (
		<div className="animate-in pb-16 duration-300 fade-in">
			{/* Breadcrumbs & Navigation */}
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<Link href="/" className="transition-colors hover:text-foreground">
						Accueil
					</Link>
					<span>/</span>
					<Link
						href="/products"
						className="transition-colors hover:text-foreground"
					>
						Produits
					</Link>
					<span>/</span>
					<span className="font-medium text-foreground capitalize">
						{product.category}
					</span>
				</div>

				<Link
					href="/products"
					className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					Retourner aux produits
				</Link>
			</div>

			{/* Main Product Layout */}
			<div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
				{/* Left Column: Image Card */}
				<div className="lg:col-span-6">
					<Card className="flex min-h-[350px] items-center justify-center overflow-hidden border-border bg-white p-8 md:min-h-[450px] dark:bg-zinc-900/40">
						<div className="relative flex aspect-square w-full max-w-[320px] items-center justify-center md:max-w-[400px]">
							<img
								src={product.image}
								alt={product.title}
								className="h-full max-h-[320px] w-auto object-contain transition-transform duration-300 hover:scale-105 md:max-h-[400px]"
							/>
						</div>
					</Card>
				</div>

				{/* Right Column: Details & Actions */}
				<div className="flex flex-col justify-between space-y-6 lg:col-span-6">
					<div className="space-y-4">
						{/* Category & Stock */}
						<div className="flex items-center justify-between">
							<Badge
								variant="outline"
								className="border-secondary/50 bg-secondary/30 px-3 py-1 font-semibold tracking-wide text-secondary-foreground capitalize"
							>
								{product.category}
							</Badge>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500 dark:bg-emerald-500/20">
								<span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
								En Stock
							</span>
						</div>

						{/* Title */}
						<h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							{product.title}
						</h1>

						{/* Rating & Reviews */}
						{rating.count > 0 && (
							<div className="flex items-center gap-2">
								<div className="flex items-center text-amber-400">
									{Array.from({ length: fullStars }).map((_, i) => (
										<Star key={`full-${i}`} className="h-4 w-4 fill-current" />
									))}
									{hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
									{Array.from({ length: emptyStars }).map((_, i) => (
										<Star
											key={`empty-${i}`}
											className="h-4 w-4 text-zinc-300 dark:text-zinc-700"
										/>
									))}
								</div>
								<span className="text-sm font-semibold text-foreground">
									{rating.rate.toFixed(1)} / 5
								</span>
								<span className="text-sm text-muted-foreground">
									({rating.count} avis clients)
								</span>
							</div>
						)}

						{/* Price */}
						<div className="pt-2">
							<span className="text-3xl font-extrabold tracking-tight text-foreground">
								{product.price.toFixed(2)} €
							</span>
							<p className="mt-1 text-xs text-muted-foreground">
								TVA incluse. Éligible à la livraison express.
							</p>
						</div>

						<Separator />

						{/* Description */}
						<div className="space-y-2">
							<h2 className="text-sm font-semibold tracking-wider text-foreground uppercase">
								Description du produit
							</h2>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{product.description}
							</p>
						</div>

						<Separator />
					</div>

					{/* Quantity selector and Add-to-cart actions */}
					<ProductActions product={product} />

					<Separator />

					{/* Trust Badges */}
					<div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
						<div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
							<Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<div>
								<h3 className="text-xs font-bold text-foreground">
									Livraison Offerte
								</h3>
								<p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
									En 2 à 4 jours chez vous
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
							<ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<div>
								<h3 className="text-xs font-bold text-foreground">
									Garantie 2 ans
								</h3>
								<p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
									Retour sous 30 jours gratuit
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
							<Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<div>
								<h3 className="text-xs font-bold text-foreground">
									Paiement Sécurisé
								</h3>
								<p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
									SSL 256-bits chiffré
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
