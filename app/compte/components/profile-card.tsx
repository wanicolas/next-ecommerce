"use client";

import * as React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
	id: number;
	email: string;
	username: string;
	name: {
		firstname: string;
		lastname: string;
	};
	phone: string;
	address: {
		city: string;
		street: string;
		number: number;
		zipcode: string;
	};
}

interface ProfileCardProps {
	usernameSession: string | null;
	userProfile: UserProfile | null;
	onLogout: () => void;
}

export function ProfileCard({
	usernameSession,
	userProfile,
	onLogout,
}: ProfileCardProps) {
	return (
		<Card className="sticky top-24 w-full border-border bg-card">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Mon Profil</CardTitle>
				<CardDescription>Détails de votre session courante</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4 text-sm">
				<div className="grid gap-1">
					<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Statut
					</span>
					<div>
						<Badge
							variant="outline"
							className="border-emerald-200 bg-emerald-50 font-bold text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400"
						>
							Connecté
						</Badge>
					</div>
				</div>

				<div className="grid gap-1">
					<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Nom d'utilisateur
					</span>
					<span className="font-semibold text-foreground">
						{usernameSession}
					</span>
				</div>

				{userProfile && (
					<>
						<Separator />
						<div className="grid gap-1">
							<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
								Nom complet
							</span>
							<span className="font-medium text-foreground">
								{userProfile.name.firstname} {userProfile.name.lastname}
							</span>
						</div>
						<div className="grid gap-1">
							<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
								Email
							</span>
							<span className="font-medium text-foreground">
								{userProfile.email}
							</span>
						</div>
						<div className="grid gap-1">
							<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
								Téléphone
							</span>
							<span className="font-medium text-foreground">
								{userProfile.phone}
							</span>
						</div>
						<div className="grid gap-1">
							<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
								Adresse
							</span>
							<span className="leading-normal font-medium text-foreground">
								{userProfile.address.number} {userProfile.address.street},<br />
								{userProfile.address.city} ({userProfile.address.zipcode})
							</span>
						</div>
					</>
				)}
			</CardContent>
			<CardFooter className="pt-2">
				<Button
					variant="destructive"
					className="w-full cursor-pointer font-semibold"
					onClick={onLogout}
				>
					Se déconnecter
				</Button>
			</CardFooter>
		</Card>
	);
}
