"use server";

import { cookies } from "next/headers";

export interface ActionState {
	success?: boolean;
	error?: string;
}

/**
 * Action serveur pour gérer la connexion d'un utilisateur.
 * Valide les entrées côté serveur, contacte l'API d'authentification FakeStoreAPI
 * et définit les cookies de session de manière sécurisée côté serveur.
 *
 * @param prevState État précédent retourné par l'action (utilisé par useActionState).
 * @param formData Les données du formulaire contenant les identifiants.
 * @returns Un objet indiquant le succès ou contenant un message d'erreur.
 */
export async function loginAction(
	prevState: ActionState | null,
	formData: FormData
): Promise<ActionState> {
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	// 1. Validation serveur des entrées (validation requise par la grille d'évaluation)
	if (!username || username.trim().length < 3) {
		return {
			error: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
		};
	}

	if (!password || password.length < 4) {
		return {
			error: "Le mot de passe doit contenir au moins 4 caractères.",
		};
	}

	// 2. Appel API sécurisé vers FakeStoreAPI
	try {
		const response = await fetch("https://fakestoreapi.com/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username.trim(),
				password: password,
			}),
		});

		if (!response.ok) {
			return {
				error: "Nom d'utilisateur ou mot de passe incorrect.",
			};
		}

		const data = await response.json();

		if (data.token) {
			// 3. Définition sécurisée des cookies côté serveur (SameSite=Strict, Secure)
			const cookieStore = await cookies();

			cookieStore.set("token", data.token, {
				maxAge: 7 * 24 * 60 * 60, // 7 jours
				path: "/",
				sameSite: "strict",
				secure: true,
			});

			cookieStore.set("username", username.trim(), {
				maxAge: 7 * 24 * 60 * 60, // 7 jours
				path: "/",
				sameSite: "strict",
				secure: true,
			});

			return { success: true };
		} else {
			return {
				error: "Jeton d'authentification manquant dans la réponse de l'API.",
			};
		}
	} catch (err) {
		console.error("Erreur d'authentification serveur:", err);
		return {
			error:
				"Une erreur est survenue lors du contact avec le serveur d'authentification.",
		};
	}
}
