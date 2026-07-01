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
import { Package, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";

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

	// Order history states
	const [orders, setOrders] = useState<any[]>([]);
	const [isLoadingOrders, setIsLoadingOrders] = useState(false);

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

	const fetchUserOrders = async (userId: number) => {
		setIsLoadingOrders(true);
		try {
			const cartsResponse = await fetch(
				`https://fakestoreapi.com/carts/user/${userId}`
			);
			const productsResponse = await fetch("https://fakestoreapi.com/products");

			if (cartsResponse.ok && productsResponse.ok) {
				const carts = await cartsResponse.json();
				const products = await productsResponse.json();

				const resolvedCarts = carts.map((cart: any) => {
					let total = 0;
					const items = cart.products.map((item: any) => {
						const prod = products.find((p: any) => p.id === item.productId);
						if (prod) {
							total += prod.price * item.quantity;
						}
						return {
							productId: item.productId,
							quantity: item.quantity,
							product: prod || {
								title: `Produit #${item.productId}`,
								price: 0,
								image: "",
							},
						};
					});
					return {
						id: cart.id,
						date: cart.date,
						items,
						total,
					};
				});

				resolvedCarts.sort(
					(a: any, b: any) =>
						new Date(b.date).getTime() - new Date(a.date).getTime()
				);
				setOrders(resolvedCarts);
			}
		} catch (err) {
			console.error("Erreur lors de la récupération des commandes", err);
		} finally {
			setIsLoadingOrders(false);
		}
	};

	useEffect(() => {
		if (userProfile?.id) {
			fetchUserOrders(userProfile.id);
		}
	}, [userProfile]);

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
		setOrders([]);
		setSuccess(null);
		setError(null);
	};

	// Logged-in Dashboard View
	if (token) {
		return (
			<div className="grid animate-in gap-8 py-8 duration-300 fade-in lg:grid-cols-12">
				{/* Sidebar: Profile Details */}
				<div className="lg:col-span-4">
					<Card className="sticky top-24 w-full border-border bg-card">
						<CardHeader>
							<CardTitle className="text-2xl font-bold">Mon Profil</CardTitle>
							<CardDescription>
								Détails de votre session courante
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 text-sm">
							<div className="grid gap-1">
								<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
									Statut
								</span>
								<div>
									<Badge
										variant="outline"
										className="border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400"
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
											{userProfile.address.number} {userProfile.address.street},
											<br />
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
								onClick={handleLogout}
							>
								Se déconnecter
							</Button>
						</CardFooter>
					</Card>
				</div>

				{/* Main Content: Orders History */}
				<div className="space-y-6 lg:col-span-8">
					<div className="flex items-center gap-2 border-b border-border pb-4">
						<Package className="h-6 w-6 text-primary" />
						<h2 className="font-heading text-2xl font-bold tracking-tight">
							Historique des Commandes
						</h2>
					</div>

					{isLoadingOrders ? (
						<div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-16 text-center">
							<Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
							<p className="text-sm font-medium text-muted-foreground">
								Chargement de votre historique de commandes...
							</p>
						</div>
					) : orders.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-16 text-center">
							<ShoppingBag className="mb-4 h-10 w-10 text-muted-foreground" />
							<h3 className="text-base font-bold text-foreground">
								Aucune commande passée
							</h3>
							<p className="mt-1 max-w-xs text-sm text-muted-foreground">
								Vous n'avez pas encore effectué d'achats avec ce compte.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{orders.map((order) => (
								<Card
									key={order.id}
									className="overflow-hidden border-border bg-card py-0! transition-all hover:shadow-md"
								>
									{/* Order Card Header */}
									<div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-muted/40 px-6 py-4">
										<div className="flex items-center gap-6">
											<div>
												<span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
													Numéro de commande
												</span>
												<span className="text-sm font-bold text-foreground">
													#{order.id}
												</span>
											</div>
											<div>
												<span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
													Date d'achat
												</span>
												<span className="text-sm font-medium text-foreground">
													{new Date(order.date).toLocaleDateString("fr-FR")}
												</span>
											</div>
										</div>
										<div className="ml-auto flex items-center gap-6 text-right">
											<div>
												<span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
													Montant Total
												</span>
												<span className="text-sm font-extrabold text-foreground">
													{order.total.toFixed(2)} €
												</span>
											</div>
											<div>
												<Badge
													variant="outline"
													className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 uppercase dark:border-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-400"
												>
													Livré
												</Badge>
											</div>
										</div>
									</div>

									{/* Order Card Items List */}
									<CardContent className="divide-y divide-border p-6">
										{order.items.map((item: any) => (
											<div
												key={item.productId}
												className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
											>
												{item.product.image ? (
													<Link
														href={`/products/${item.productId}`}
														className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1 transition-opacity hover:opacity-95"
													>
														<img
															src={item.product.image}
															alt=""
															className="h-full w-full object-contain"
														/>
													</Link>
												) : (
													<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted">
														<ShoppingBag className="h-6 w-6 text-muted-foreground" />
													</div>
												)}

												<div className="min-w-0 flex-1">
													<Link
														href={`/products/${item.productId}`}
														className="block truncate text-sm font-bold text-foreground transition-colors hover:text-primary hover:underline"
													>
														{item.product.title}
													</Link>
													<span className="mt-1 block text-xs text-muted-foreground">
														Quantité : {item.quantity} ×{" "}
														{item.product.price.toFixed(2)} €
													</span>
												</div>

												<span className="shrink-0 pl-4 text-sm font-bold text-foreground">
													{(item.product.price * item.quantity).toFixed(2)} €
												</span>
											</div>
										))}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
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
