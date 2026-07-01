import * as React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
	/**
	 * Données de notation provenant de l'API (contient la note moyenne et le nombre d'avis).
	 */
	rating?: {
		rate: number;
		count: number;
	};
	/**
	 * Variante d'affichage :
	 * - `compact` : Affiche 1 seule étoile avec la note moyenne et le total d'avis (idéal pour les cartes du catalogue).
	 * - `full` : Affiche la barre complète des 5 étoiles avec les demis-étoiles et le détail textuel (idéal pour la fiche produit).
	 */
	variant?: "full" | "compact";
	/**
	 * Classes CSS supplémentaires (Tailwind).
	 */
	className?: string;
}

/**
 * Composant de notation par étoiles réutilisable.
 * Centralise l'affichage des avis clients sous forme d'étoiles pleines, vides ou intermédiaires.
 */
export function StarRating({
	rating,
	variant = "compact",
	className,
}: StarRatingProps) {
	const rate = rating?.rate ?? 0;
	const count = rating?.count ?? 0;

	if (count === 0) return null;

	if (variant === "compact") {
		return (
			<div className={cn("flex items-center gap-1 text-xs", className)}>
				<Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
				<span className="font-bold text-foreground">{rate.toFixed(1)}</span>
				<span className="text-muted-foreground">({count})</span>
			</div>
		);
	}

	// Full 5-stars logic
	const fullStars = Math.floor(rate);
	const hasHalfStar = rate % 1 >= 0.5;
	const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="flex shrink-0 items-center text-amber-400">
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
				{rate.toFixed(1)} / 5
			</span>
			<span className="text-sm text-muted-foreground">
				({count} avis clients)
			</span>
		</div>
	);
}
