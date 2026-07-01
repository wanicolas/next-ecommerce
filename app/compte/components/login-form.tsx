"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginAction } from "../actions";

interface LoginFormProps {
	onSuccess: () => void;
	onError: (msg: string | null) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
	// React 19 hook to manage Server Actions state natively
	const [state, formAction, isPending] = useActionState(loginAction, null);

	useEffect(() => {
		if (state?.error) {
			onError(state.error);
		} else if (state?.success) {
			onError(null);
			onSuccess();
		}
	}, [state, onSuccess, onError]);

	return (
		<form action={formAction} className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="username">Nom d&apos;utilisateur</Label>
				<Input
					id="username"
					name="username"
					type="text"
					placeholder="Ex: mor_2314 (johnd)"
					disabled={isPending}
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="password">Mot de passe</Label>
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="••••••••"
					disabled={isPending}
					required
				/>
			</div>

			<Button
				type="submit"
				className="w-full cursor-pointer font-semibold"
				disabled={isPending}
			>
				{isPending ? "Connexion..." : "Se connecter"}
			</Button>
		</form>
	);
}
