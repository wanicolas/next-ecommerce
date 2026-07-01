import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Laptop,
	Gem,
	Shirt,
	Sparkles,
	Truck,
	RotateCcw,
	ShieldCheck,
	ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { WishlistButton } from "@/components/wishlist-button";

interface Product {
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

const CATEGORY_CARDS = [
	{
		id: "electronics",
		label: "Électronique",
		description: "Écrans, smartphones et accessoires de pointe",
		icon: Laptop,
		color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
	},
	{
		id: "jewelery",
		label: "Bijoux",
		description: "Bracelets, bagues et colliers d'exception",
		icon: Gem,
		color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
	},
	{
		id: "men's clothing",
		label: "Mode Homme",
		description: "Vestes, chemises et vêtements casual",
		icon: Shirt,
		color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
	},
	{
		id: "women's clothing",
		label: "Mode Femme",
		description: "Robes, pulls et vêtements tendances",
		icon: Sparkles,
		color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
	},
];

export default async function Page() {
	const response = await fetch("https://fakestoreapi.com/products");
	let popularProducts: Product[] = [];

	if (response.ok) {
		const products: Product[] = await response.json();
		// Get top 4 highest rated products
		popularProducts = [...products]
			.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
			.slice(0, 4);
	}

	return (
		<div className="animate-in space-y-16 pb-16 duration-500 fade-in">
			{/* 1. Hero Banner Section */}
			<section className="relative animate-in space-y-6 overflow-hidden rounded-3xl border border-border bg-zinc-50 px-6 py-20 text-center text-foreground shadow-sm duration-300 fade-in sm:px-12 md:px-20 dark:bg-zinc-900/30">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_60%)] opacity-5 dark:opacity-15" />
				<Badge className="rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase dark:border-primary/30 dark:bg-primary/20 dark:text-primary">
					Nouvelle Saison 2026
				</Badge>
				<h1 className="mx-auto max-w-3xl font-heading text-4xl leading-tight font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
					Sublimez votre style au meilleur prix
				</h1>
				<p className="mx-auto max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
					Explorez notre sélection exclusive d&apos;articles de mode, de
					joaillerie raffinée et de technologies de pointe sélectionnés avec
					soin.
				</p>
				<div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
					<Button
						asChild
						size="lg"
						className="w-full cursor-pointer bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 sm:w-auto"
					>
						<Link href="/products">Découvrir la collection</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="w-full cursor-pointer border-border font-bold text-muted-foreground hover:bg-muted hover:text-foreground sm:w-auto"
					>
						<Link href="/products?category=electronics">
							Voir la technologie
						</Link>
					</Button>
				</div>
			</section>

			{/* 2. Brand Value Reassurance Banner */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
				<div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-5">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<Truck className="h-5 w-5" />
					</div>
					<div>
						<h3 className="text-sm font-bold text-foreground">
							Livraison Offerte
						</h3>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Dès 50 € d&apos;achats partout en France
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-5">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<RotateCcw className="h-5 w-5" />
					</div>
					<div>
						<h3 className="text-sm font-bold text-foreground">
							Retours sous 30 jours
						</h3>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Satisfait ou remboursé sans justificatif
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-5">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<ShieldCheck className="h-5 w-5" />
					</div>
					<div>
						<h3 className="text-sm font-bold text-foreground">
							Paiement 100% Sécurisé
						</h3>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Chiffrement SSL 256 bits et authentification 3D
						</p>
					</div>
				</div>
			</div>

			{/* 3. Category Navigation Grid */}
			<section className="space-y-6">
				<div className="flex items-center justify-between border-b border-border pb-4">
					<h2 className="font-heading text-2xl font-bold tracking-tight">
						Acheter par catégorie
					</h2>
					<Button asChild variant="ghost" size="sm" className="cursor-pointer">
						<Link
							href="/products"
							className="text-xs font-semibold text-primary"
						>
							Voir tout le catalogue →
						</Link>
					</Button>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{CATEGORY_CARDS.map((cat) => {
						const IconComponent = cat.icon;
						return (
							<Link
								href={`/products?category=${cat.id}`}
								key={cat.id}
								className="group"
							>
								<Card className="flex h-full cursor-pointer flex-col justify-between rounded-2xl border border-border/85 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-muted/20 hover:shadow-lg">
									<div className="space-y-3">
										<div
											className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${cat.color}`}
										>
											<IconComponent className="h-5 w-5" />
										</div>
										<h3 className="text-sm font-extrabold tracking-wide text-foreground uppercase">
											{cat.label}
										</h3>
										<p className="text-xs leading-normal text-muted-foreground">
											{cat.description}
										</p>
									</div>
									<span className="flex items-center gap-1 pt-4 text-[10px] font-bold text-primary group-hover:underline">
										Découvrir la sélection <ArrowRight className="h-3 w-3" />
									</span>
								</Card>
							</Link>
						);
					})}
				</div>
			</section>

			{/* 4. Dynamic Popular Products Grid */}
			{popularProducts.length > 0 && (
				<section className="space-y-6">
					<div className="flex items-center justify-between border-b border-border pb-4">
						<h2 className="font-heading text-2xl font-bold tracking-tight">
							Sélection Coup de Cœur
						</h2>
						<span className="text-xs text-muted-foreground">
							Nos articles les mieux notés
						</span>
					</div>

					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{popularProducts.map((product) => (
							<Link
								href={`/products/${product.id}`}
								key={product.id}
								className="group"
							>
								<Card className="relative flex h-full flex-col overflow-hidden rounded-xl border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
									{/* Image */}
									<div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-white p-6">
										<Image
											src={product.image}
											alt={product.title}
											width={180}
											height={140}
											className="h-full max-h-[140px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
										/>
										<WishlistButton
											product={product}
											className="absolute top-3 right-3 z-10"
										/>
									</div>

									{/* Body */}
									<CardHeader className="flex-1 space-y-2 p-5 pb-3">
										<div className="flex items-center justify-between gap-2">
											<Badge
												variant="outline"
												className="border-secondary/50 bg-secondary/30 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground capitalize"
											>
												{product.category}
											</Badge>
											<StarRating rating={product.rating} variant="compact" />
										</div>

										<CardTitle className="line-clamp-2 min-h-[40px] text-sm leading-snug font-bold transition-colors group-hover:text-primary">
											{product.title}
										</CardTitle>
									</CardHeader>

									{/* Footer */}
									<CardFooter className="mt-auto flex items-center justify-between p-5 pt-0">
										<span className="text-base font-extrabold text-foreground">
											{product.price.toFixed(2)} €
										</span>
										<span className="flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
											Voir <ArrowRight className="h-3 w-3" />
										</span>
									</CardFooter>
								</Card>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
