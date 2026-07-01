"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
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

export function ProductCatalog({ products, initialCategory = "all" }: ProductCatalogProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(initialCategory);
	const [sortBy, setSortBy] = useState("relevance");

	// Update category state if initialCategory changes (e.g. router redirection)
	useEffect(() => {
		setSelectedCategory(initialCategory || "all");
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
			if (sortBy === "rating") return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
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

	const isFiltered = searchQuery !== "" || selectedCategory !== "all" || sortBy !== "relevance";

	return (
		<div className="space-y-8 animate-in fade-in duration-300">
			{/* Filters and Controls Toolbar */}
			<div className="flex flex-col gap-4 p-4 border border-border rounded-2xl bg-card/45 shadow-sm md:p-6">
				<div className="flex flex-col sm:flex-row items-center gap-4">
					{/* Search Bar */}
					<div className="relative w-full sm:flex-1">
						<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Rechercher un vêtement, bijou, montre..."
							className="pl-10 h-10 bg-background/50 border-border/80 focus-visible:ring-primary/40"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery("")}
								className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
								aria-label="Effacer la recherche"
							>
								<X className="h-3 w-3" />
							</button>
						)}
					</div>

					{/* Sorting Selector */}
					<div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
						<SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="flex h-10 w-full sm:w-[180px] rounded-lg border border-border bg-background px-3 py-1 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 cursor-pointer"
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
				<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
					{CATEGORIES.map((cat) => (
						<button
							key={cat.id}
							onClick={() => handleCategoryChange(cat.id)}
							className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all cursor-pointer capitalize ${
								selectedCategory === cat.id
									? "bg-primary border-primary text-primary-foreground shadow-sm hover:opacity-90"
									: "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-background/60"
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
							className="ml-auto text-xs text-muted-foreground hover:text-destructive cursor-pointer h-7 px-2.5 rounded-full hover:bg-destructive/5"
						>
							<X className="mr-1 h-3 w-3" /> Réinitialiser les filtres
						</Button>
					)}
				</div>
			</div>

			{/* Products Count Indicator */}
			<div className="flex items-center justify-between">
				<p className="text-xs text-muted-foreground font-semibold">
					{filteredProducts.length}{" "}
					{filteredProducts.length > 1 ? "produits correspondants" : "produit correspondant"}
				</p>
			</div>

			{/* Catalogue Grid */}
			{filteredProducts.length === 0 ? (
				<div className="flex flex-col items-center justify-center p-16 border border-dashed border-border rounded-2xl bg-card/30 text-center animate-in fade-in duration-300">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
						<Search className="h-6 w-6" />
					</div>
					<h3 className="text-lg font-bold text-foreground">
						Aucun résultat trouvé
					</h3>
					<p className="text-sm text-muted-foreground mt-1 max-w-sm">
						Désolé, aucun produit ne correspond à votre recherche. Essayez d'autres mots clés ou modifiez vos filtres.
					</p>
					<Button
						className="mt-6 font-semibold cursor-pointer"
						onClick={handleResetFilters}
					>
						Effacer les filtres
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
					{filteredProducts.map((product) => (
						<Link
							href={"/products/" + product.id}
							key={product.id}
							className="group"
						>
							<Card className="h-full flex flex-col overflow-hidden border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl">
								{/* Image container */}
								<div className="bg-white p-6 aspect-[4/3] flex items-center justify-center relative overflow-hidden border-b border-border">
									<img
										src={product.image}
										alt={product.title}
										className="h-full max-h-[160px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
										loading="lazy"
									/>
									<WishlistButton
										product={product}
										className="absolute top-3 right-3 z-10"
									/>
								</div>

								{/* Info */}
								<CardHeader className="flex-1 p-6 space-y-2 pb-3">
									<div className="flex items-center justify-between gap-2">
										<Badge
											variant="outline"
											className="capitalize text-[10px] px-2 py-0.5 font-semibold bg-secondary/30 text-secondary-foreground border-secondary/50"
										>
											{product.category}
										</Badge>
										<StarRating rating={product.rating} variant="compact" />
									</div>

									<CardTitle className="line-clamp-2 min-h-[48px] text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
										{product.title}
									</CardTitle>

									<CardDescription className="line-clamp-2 text-xs text-muted-foreground leading-relaxed pt-1">
										{product.description}
									</CardDescription>
								</CardHeader>

								{/* Footer */}
								<CardFooter className="p-6 pt-0 flex items-center justify-between mt-auto">
									<span className="text-lg font-extrabold text-foreground">
										{product.price.toFixed(2)} €
									</span>
									<span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1 transition-all">
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
