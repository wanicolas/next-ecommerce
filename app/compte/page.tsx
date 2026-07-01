"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Cookie helper utilities
function getCookie(name: string): string | null {
	if (typeof document === "undefined") return null;
	const nameEQ = name + "=";
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function setCookie(name: string, value: string, days = 7) {
	if (typeof document === "undefined") return;
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Strict; Secure`;
}

function eraseCookie(name: string) {
	if (typeof document === "undefined") return;
	document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure`;
}

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

export default function Page() {
	// Authentication state
	const [token, setToken] = useState<string | null>(null);
	const [usernameSession, setUsernameSession] = useState<string | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	// Navigation state
	const [isLogin, setIsLogin] = useState(true);

	// Form inputs state
	const [usernameInput, setUsernameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [emailInput, setEmailInput] = useState("");
	const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

	// UI controls state
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Load session on mount
	useEffect(() => {
		const storedToken = getCookie("token");
		const storedUsername = getCookie("username");
		if (storedToken && storedUsername) {
			setToken(storedToken);
			setUsernameSession(storedUsername);
			fetchUserProfile(storedUsername);
		}
	}, []);

	// Clear temporary notifications when switching forms
	useEffect(() => {
		setError(null);
		setSuccess(null);
	}, [isLogin]);

	// Fetch user details from FakeStoreAPI list matching the username
	const fetchUserProfile = async (username: string) => {
		try {
			const response = await fetch("https://fakestoreapi.com/users");
			if (response.ok) {
				const users = await response.json();
				const user = users.find((u: any) => u.username === username);
				if (user) {
					setUserProfile(user);
				}
			}
		} catch (err) {
			console.error(
				"Erreur lors de la récupération des détails de l'utilisateur",
				err
			);
		}
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		if (!usernameInput || !passwordInput) {
			setError("Veuillez remplir tous les champs.");
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch("https://fakestoreapi.com/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: usernameInput,
					password: passwordInput,
				}),
			});

			if (!response.ok) {
				throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
			}

			const data = await response.json();
			if (data.token) {
				setCookie("token", data.token, 7);
				setCookie("username", usernameInput, 7);
				setToken(data.token);
				setUsernameSession(usernameInput);
				await fetchUserProfile(usernameInput);
				setSuccess("Connexion réussie.");
				// Clean up inputs
				setUsernameInput("");
				setPasswordInput("");
			} else {
				throw new Error("Jeton manquant dans la réponse de l'API.");
			}
		} catch (err: any) {
			setError(
				err.message || "Une erreur s'est produite lors de la connexion."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		if (
			!emailInput ||
			!usernameInput ||
			!passwordInput ||
			!confirmPasswordInput
		) {
			setError("Veuillez remplir tous les champs.");
			return;
		}

		if (passwordInput !== confirmPasswordInput) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}

		setIsLoading(true);
		try {
			// Official user structure based on FakeStoreAPI docs
			const response = await fetch("https://fakestoreapi.com/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: emailInput,
					username: usernameInput,
					password: passwordInput,
					name: {
						firstname: "John",
						lastname: "Doe",
					},
					address: {
						city: "kilcoole",
						street: "7835 new road",
						number: 3,
						zipcode: "12926-3874",
						geolocation: {
							lat: "-37.3159",
							long: "81.1496",
						},
					},
					phone: "1-570-236-7033",
				}),
			});

			if (!response.ok) {
				throw new Error(
					"Une erreur est survenue lors de la simulation d'inscription."
				);
			}

			const data = await response.json();
			setSuccess(
				`Compte simulé créé ! (ID: ${data.id}). Note : FakeStoreAPI ne stocke pas les données en base de données. Veuillez utiliser un utilisateur existant de l'API (ex : johnd / m38rmF$) pour vous connecter.`
			);

			// Clean up inputs
			setEmailInput("");
			setUsernameInput("");
			setPasswordInput("");
			setConfirmPasswordInput("");

			// Switch to login screen
			setTimeout(() => {
				setIsLogin(true);
			}, 4000);
		} catch (err: any) {
			setError(
				err.message || "Une erreur s'est produite lors de l'inscription."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = () => {
		eraseCookie("token");
		eraseCookie("username");
		setToken(null);
		setUsernameSession(null);
		setUserProfile(null);
		setSuccess(null);
		setError(null);
	};

	// Logged-in Dashboard View
	if (token) {
		return (
			<div className="flex justify-center py-8">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Mon Compte</CardTitle>
						<CardDescription>Détails de votre session courante</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="grid gap-1">
							<span className="text-xs text-muted-foreground">Statut</span>
							<div>
								<Badge
									variant="outline"
									className="border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400"
								>
									Connecté
								</Badge>
							</div>
						</div>

						<div className="grid gap-1">
							<span className="text-xs text-muted-foreground">
								Nom d'utilisateur
							</span>
							<span className="text-sm font-medium">{usernameSession}</span>
						</div>

						{userProfile && (
							<>
								<Separator />
								<div className="grid gap-1">
									<span className="text-xs text-muted-foreground">
										Nom complet
									</span>
									<span className="text-sm font-medium">
										{userProfile.name.firstname} {userProfile.name.lastname}
									</span>
								</div>
								<div className="grid gap-1">
									<span className="text-xs text-muted-foreground">Email</span>
									<span className="text-sm font-medium">
										{userProfile.email}
									</span>
								</div>
								<div className="grid gap-1">
									<span className="text-xs text-muted-foreground">
										Téléphone
									</span>
									<span className="text-sm font-medium">
										{userProfile.phone}
									</span>
								</div>
								<div className="grid gap-1">
									<span className="text-xs text-muted-foreground">Adresse</span>
									<span className="text-sm font-medium">
										{userProfile.address.number} {userProfile.address.street},{" "}
										{userProfile.address.city} ({userProfile.address.zipcode})
									</span>
								</div>
							</>
						)}
					</CardContent>
					<CardFooter>
						<Button
							variant="destructive"
							className="w-full"
							onClick={handleLogout}
						>
							Se déconnecter
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	// Login and Register Forms View
	return (
		<div className="flex justify-center py-8">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						{isLogin ? "Connexion" : "Inscription"}
					</CardTitle>
					<CardDescription>
						{isLogin
							? "Saisissez vos identifiants pour accéder à votre espace."
							: "Entrez vos informations pour simuler l'enregistrement."}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{/* Status feedback alerts */}
					{error && (
						<p className="text-sm font-medium text-destructive">{error}</p>
					)}
					{success && (
						<p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
							{success}
						</p>
					)}

					{isLogin ? (
						/* LOGIN FORM */
						<form onSubmit={handleLogin} className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="username">Nom d'utilisateur</Label>
								<Input
									id="username"
									type="text"
									placeholder="Ex: mor_2314"
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

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Connexion..." : "Se connecter"}
							</Button>
						</form>
					) : (
						/* REGISTRATION FORM */
						<form onSubmit={handleRegister} className="grid gap-4">
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
								<Label htmlFor="confirm-password">
									Confirmer le mot de passe
								</Label>
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

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Création du compte..." : "Créer un compte"}
							</Button>
						</form>
					)}
				</CardContent>
				<Separator />
				<CardFooter className="flex justify-center">
					<Button
						variant="link"
						className="px-0 font-normal"
						onClick={() => setIsLogin(!isLogin)}
						disabled={isLoading}
					>
						{isLogin ? "Créer un compte" : "Se connecter"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
