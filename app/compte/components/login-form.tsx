"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
	onSubmit: (username: string, password: string) => void;
	isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
	const [usernameInput, setUsernameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!usernameInput || !passwordInput) return;
		onSubmit(usernameInput, passwordInput);
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="username">Nom d'utilisateur</Label>
				<Input
					id="username"
					type="text"
					placeholder="Ex: mor_2314 (johnd)"
					value={usernameInput}
					onChange={(e) => setUsernameInput(e.target.value)}
					disabled={isLoading}
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="password">Mot de passe</Label>
				<Input
					id="password"
					type="password"
					placeholder="••••••••"
					value={passwordInput}
					onChange={(e) => setPasswordInput(e.target.value)}
					disabled={isLoading}
					required
				/>
			</div>

			<Button
				type="submit"
				className="w-full cursor-pointer font-semibold"
				disabled={isLoading}
			>
				{isLoading ? "Connexion..." : "Se connecter"}
			</Button>
		</form>
	);
}
