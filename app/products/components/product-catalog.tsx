"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, X, SlidersHorizontal } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface ProductCatalogProps {
	products: Product[];
	initialCategory?: string;
}

const CATEGORIES = [
	{ id: "all", label: "Tous" },
	{ id: "electronics", label: "Électronique" },
	{ id: "jewelery", label: "Bijoux" },
	{ id: "men's clothing", label: "Mode Homme" },
	{ id: "women's clothing", label: "Mode Femme" },
];

export function ProductCatalog({
	products,
	initialCategory = "all",
}: ProductCatalogProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(initialCategory);
	const [sortBy, setSortBy] = useState("relevance");

	// Update category state if initialCategory changes (e.g. router redirection)
	useEffect(() => {
		setTimeout(() => {
			setSelectedCategory(initialCategory || "all");
		}, 0);
	}, [initialCategory]);

	// Filter and sort products
	const filteredProducts = products
		.filter((product) => {
			const matchesSearch =
				product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategory === "all" || product.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
		.sort((a, b) => {
			if (sortBy === "price-asc") return a.price - b.price;
			if (sortBy === "price-desc") return b.price - a.price;
			if (sortBy === "rating")
				return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
			return 0; // relevance / API natural order
		});

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);

		// Update browser history query parameters without full page reload
		const params = new URLSearchParams(window.location.search);
		if (category === "all") {
			params.delete("category");
		} else {
			params.set("category", category);
		}

		const newUrl = params.toString()
			? `${window.location.pathname}?${params.toString()}`
			: window.location.pathname;

		window.history.pushState(null, "", newUrl);
	};

	const handleResetFilters = () => {
		setSearchQuery("");
		setSelectedCategory("all");
		setSortBy("relevance");
		window.history.pushState(null, "", window.location.pathname);
	};

	const isFiltered =
		searchQuery !== "" || selectedCategory !== "all" || sortBy !== "relevance";

	return (
		<div className="animate-in space-y-8 duration-300 fade-in">
			{/* Filters and Controls Toolbar */}
			<div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/45 p-4 shadow-sm md:p-6">
				<div className="flex flex-col items-center gap-4 sm:flex-row">
					{/* Search Bar */}
					<div className="relative w-full sm:flex-1">
						<Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Rechercher un vêtement, bijou, montre..."
							className="h-10 border-border/80 bg-background/50 pl-10 focus-visible:ring-primary/40"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery("")}
								className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								aria-label="Effacer la recherche"
							>
								<X className="h-3 w-3" />
							</button>
						)}
					</div>

					{/* Sorting Selector */}
					<div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
						<SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="flex h-10 w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-1 text-sm shadow-sm transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/40 focus:outline-none sm:w-[180px]"
							aria-label="Trier les produits"
						>
							<option value="relevance">Pertinence</option>
							<option value="price-asc">Prix : Croissant</option>
							<option value="price-desc">Prix : Décroissant</option>
							<option value="rating">Mieux notés</option>
						</select>
					</div>
				</div>

				{/* Category Badges Filter Bar */}
				<div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-2">
					{CATEGORIES.map((cat) => (
						<button
							key={cat.id}
							onClick={() => handleCategoryChange(cat.id)}
							className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
								selectedCategory === cat.id
									? "border-primary bg-primary text-primary-foreground shadow-sm hover:opacity-90"
									: "border-border/80 bg-card text-muted-foreground hover:border-foreground/20 hover:bg-background/60 hover:text-foreground"
							}`}
						>
							{cat.label}
						</button>
					))}

					{isFiltered && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleResetFilters}
							className="ml-auto h-7 cursor-pointer rounded-full px-2.5 text-xs text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
						>
							<X className="mr-1 h-3 w-3" /> Réinitialiser les filtres
						</Button>
					)}
				</div>
			</div>

			{/* Products Count Indicator */}
			<div className="flex items-center justify-between">
				<p className="text-xs font-semibold text-muted-foreground">
					{filteredProducts.length}{" "}
					{filteredProducts.length > 1
						? "produits correspondants"
						: "produit correspondant"}
				</p>
			</div>

			{/* Catalogue Grid */}
			{filteredProducts.length === 0 ? (
				<div className="flex animate-in flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-16 text-center duration-300 fade-in">
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
						<Search className="h-6 w-6" />
					</div>
					<h3 className="text-lg font-bold text-foreground">
						Aucun résultat trouvé
					</h3>
					<p className="mt-1 max-w-sm text-sm text-muted-foreground">
						Désolé, aucun produit ne correspond à votre recherche. Essayez
						d&apos;autres mots clés ou modifiez vos filtres.
					</p>
					<Button
						className="mt-6 cursor-pointer font-semibold"
						onClick={handleResetFilters}
					>
						Effacer les filtres
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
					{filteredProducts.map((product) => (
						<Link
							href={"/products/" + product.id}
							key={product.id}
							className="group"
						>
							<Card className="flex h-full flex-col overflow-hidden rounded-xl border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
								{/* Image container */}
								<div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-white p-6">
									<Image
										src={product.image}
										alt={product.title}
										width={200}
										height={160}
										className="h-full max-h-[160px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
									/>
									<WishlistButton
										product={product}
										className="absolute top-3 right-3 z-10"
									/>
								</div>

								{/* Info */}
								<CardHeader className="flex-1 space-y-2 p-6 pb-3">
									<div className="flex items-center justify-between gap-2">
										<Badge
											variant="outline"
											className="border-secondary/50 bg-secondary/30 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground capitalize"
										>
											{product.category}
										</Badge>
										<StarRating rating={product.rating} variant="compact" />
									</div>

									<CardTitle className="line-clamp-2 min-h-[48px] text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
										{product.title}
									</CardTitle>

									<CardDescription className="line-clamp-2 pt-1 text-xs leading-relaxed text-muted-foreground">
										{product.description}
									</CardDescription>
								</CardHeader>

								{/* Footer */}
								<CardFooter className="mt-auto flex items-center justify-between p-6 pt-0">
									<span className="text-lg font-extrabold text-foreground">
										{product.price.toFixed(2)} €
									</span>
									<span className="flex items-center gap-1 text-xs font-bold text-primary transition-all group-hover:underline">
										Voir le produit <ArrowRight className="h-3.5 w-3.5" />
									</span>
								</CardFooter>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
