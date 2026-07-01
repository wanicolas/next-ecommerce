"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
	onSubmit: (email: string, username: string, password: string) => void;
	isLoading: boolean;
	onError: (msg: string) => void;
}

export function RegisterForm({
	onSubmit,
	isLoading,
	onError,
}: RegisterFormProps) {
	const [emailInput, setEmailInput] = useState("");
	const [usernameInput, setUsernameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!emailInput ||
			!usernameInput ||
			!passwordInput ||
			!confirmPasswordInput
		) {
			onError("Veuillez remplir tous les champs.");
			return;
		}

		if (passwordInput !== confirmPasswordInput) {
			onError("Les mots de passe ne correspondent pas.");
			return;
		}

		onSubmit(emailInput, usernameInput, passwordInput);
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="nom@exemple.com"
					value={emailInput}
					onChange={(e) => setEmailInput(e.target.value)}
					disabled={isLoading}
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="reg-username">Nom d'utilisateur</Label>
				<Input
					id="reg-username"
					type="text"
					placeholder="Choisissez un pseudonyme"
					value={usernameInput}
					onChange={(e) => setUsernameInput(e.target.value)}
					disabled={isLoading}
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="reg-password">Mot de passe</Label>
				<Input
					id="reg-password"
					type="password"
					placeholder="••••••••"
					value={passwordInput}
					onChange={(e) => setPasswordInput(e.target.value)}
					disabled={isLoading}
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
				<Input
					id="confirm-password"
					type="password"
					placeholder="••••••••"
					value={confirmPasswordInput}
					onChange={(e) => setConfirmPasswordInput(e.target.value)}
					disabled={isLoading}
					required
				/>
			</div>

			<Button
				type="submit"
				className="w-full cursor-pointer font-semibold"
				disabled={isLoading}
			>
				{isLoading ? "Création du compte..." : "Créer un compte"}
			</Button>
		</form>
	);
}
