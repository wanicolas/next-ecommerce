import * as React from "react";
import Link from "next/link";
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
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
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
		<div className="space-y-16 pb-16 animate-in fade-in duration-500">
			{/* 1. Hero Banner Section */}
			<section className="relative rounded-3xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/30 border border-border text-foreground py-20 px-6 sm:px-12 md:px-20 text-center space-y-6 shadow-sm animate-in fade-in duration-300">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_60%)] opacity-5 dark:opacity-15 pointer-events-none" />
				<Badge className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30 px-3 py-1 font-semibold text-xs rounded-full uppercase tracking-wider">
					Nouvelle Saison 2026
				</Badge>
				<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-heading max-w-3xl mx-auto leading-tight text-foreground">
					Sublimez votre style au meilleur prix
				</h1>
				<p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-sans">
					Explorez notre sélection exclusive d'articles de mode, de joaillerie raffinée et de technologies de pointe sélectionnés avec soin.
				</p>
				<div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
					<Button
						asChild
						size="lg"
						className="w-full sm:w-auto font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 cursor-pointer"
					>
						<Link href="/products">Découvrir la collection</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="w-full sm:w-auto font-bold border-border hover:bg-muted hover:text-foreground text-muted-foreground cursor-pointer"
					>
						<Link href="/products?category=electronics">Voir la technologie</Link>
					</Button>
				</div>
			</section>

			{/* 2. Brand Value Reassurance Banner */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				<div className="flex items-center gap-4 p-5 rounded-2xl border border-border/80 bg-card">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<Truck className="h-5 w-5" />
					</div>
					<div>
						<h3 className="font-bold text-sm text-foreground">Livraison Offerte</h3>
						<p className="text-xs text-muted-foreground mt-0.5">Dès 50 € d'achats partout en France</p>
					</div>
				</div>

				<div className="flex items-center gap-4 p-5 rounded-2xl border border-border/80 bg-card">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<RotateCcw className="h-5 w-5" />
					</div>
					<div>
						<h3 className="font-bold text-sm text-foreground">Retours sous 30 jours</h3>
						<p className="text-xs text-muted-foreground mt-0.5">Satisfait ou remboursé sans justificatif</p>
					</div>
				</div>

				<div className="flex items-center gap-4 p-5 rounded-2xl border border-border/80 bg-card">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<ShieldCheck className="h-5 w-5" />
					</div>
					<div>
						<h3 className="font-bold text-sm text-foreground">Paiement 100% Sécurisé</h3>
						<p className="text-xs text-muted-foreground mt-0.5">Chiffrement SSL 256 bits et authentification 3D</p>
					</div>
				</div>
			</div>

			{/* 3. Category Navigation Grid */}
			<section className="space-y-6">
				<div className="flex items-center justify-between border-b border-border pb-4">
					<h2 className="text-2xl font-bold tracking-tight font-heading">
						Acheter par catégorie
					</h2>
					<Button asChild variant="ghost" size="sm" className="cursor-pointer">
						<Link href="/products" className="text-xs text-primary font-semibold">
							Voir tout le catalogue →
						</Link>
					</Button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{CATEGORY_CARDS.map((cat) => {
						const IconComponent = cat.icon;
						return (
							<Link
								href={`/products?category=${cat.id}`}
								key={cat.id}
								className="group"
							>
								<Card className="h-full flex flex-col justify-between p-6 border border-border/85 bg-card hover:bg-muted/20 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl cursor-pointer">
									<div className="space-y-3">
										<div className={`w-12 h-12 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform duration-300 ${cat.color}`}>
											<IconComponent className="h-5 w-5" />
										</div>
										<h3 className="font-extrabold text-sm text-foreground uppercase tracking-wide">
											{cat.label}
										</h3>
										<p className="text-xs text-muted-foreground leading-normal">
											{cat.description}
										</p>
									</div>
									<span className="text-[10px] font-bold text-primary flex items-center gap-1 group-hover:underline pt-4">
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
						<h2 className="text-2xl font-bold tracking-tight font-heading">
							Sélection Coup de Cœur
						</h2>
						<span className="text-xs text-muted-foreground">
							Nos articles les mieux notés
						</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{popularProducts.map((product) => (
							<Link
								href={`/products/${product.id}`}
								key={product.id}
								className="group"
							>
								<Card className="h-full flex flex-col overflow-hidden border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl relative">
									{/* Image */}
									<div className="bg-white p-6 aspect-[4/3] flex items-center justify-center relative overflow-hidden border-b border-border">
										<img
											src={product.image}
											alt={product.title}
											className="h-full max-h-[140px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
											loading="lazy"
										/>
										<WishlistButton
											product={product}
											className="absolute top-3 right-3 z-10"
										/>
									</div>

									{/* Body */}
									<CardHeader className="flex-1 p-5 space-y-2 pb-3">
										<div className="flex items-center justify-between gap-2">
											<Badge
												variant="outline"
												className="capitalize text-[10px] px-2 py-0.5 font-semibold bg-secondary/30 text-secondary-foreground border-secondary/50"
											>
												{product.category}
											</Badge>
											<StarRating rating={product.rating} variant="compact" />
										</div>

										<CardTitle className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-primary transition-colors min-h-[40px]">
											{product.title}
										</CardTitle>
									</CardHeader>

									{/* Footer */}
									<CardFooter className="p-5 pt-0 flex items-center justify-between mt-auto">
										<span className="text-base font-extrabold text-foreground">
											{product.price.toFixed(2)} €
										</span>
										<span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
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
