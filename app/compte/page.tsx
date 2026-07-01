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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { getCookie, eraseCookie } from "@/lib/cookies";
import { LoginForm } from "./components/login-form";
import { RegisterForm } from "./components/register-form";
import { ProfileCard } from "./components/profile-card";
import { OrderHistory } from "./components/order-history";

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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [orders, setOrders] = useState<any[]>([]);
	const [isLoadingOrders, setIsLoadingOrders] = useState(false);

	// Navigation state
	const [isLogin, setIsLogin] = useState(true);

	// UI controls state
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Fetch user details from FakeStoreAPI list matching the username
	const fetchUserProfile = async (username: string) => {
		try {
			const response = await fetch("https://fakestoreapi.com/users");
			if (response.ok) {
				const users = await response.json();
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	// Load session on mount
	useEffect(() => {
		const storedToken = getCookie("token");
		const storedUsername = getCookie("username");
		if (storedToken && storedUsername) {
			setTimeout(() => {
				setToken(storedToken);
				setUsernameSession(storedUsername);
				fetchUserProfile(storedUsername);
			}, 0);
		}
	}, []);

	// Clear temporary notifications when switching forms
	useEffect(() => {
		setTimeout(() => {
			setError(null);
			setSuccess(null);
		}, 0);
	}, [isLogin]);

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

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const resolvedCarts = carts.map((cart: any) => {
					let total = 0;
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const items = cart.products.map((item: any) => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			setTimeout(() => {
				fetchUserOrders(userProfile.id);
			}, 0);
		}
	}, [userProfile]);

	const handleLoginSuccess = async () => {
		setError(null);
		setSuccess(null);
		const storedToken = getCookie("token");
		const storedUsername = getCookie("username");
		if (storedToken && storedUsername) {
			setToken(storedToken);
			setUsernameSession(storedUsername);
			await fetchUserProfile(storedUsername);
			setSuccess("Connexion réussie.");
		}
	};

	const handleRegister = async (
		emailInput: string,
		usernameInput: string,
		passwordInput: string
	) => {
		setError(null);
		setSuccess(null);
		setIsLoading(true);
		try {
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
				`Compte simulé créé ! (ID: ${data.id}). Note : FakeStoreAPI ne stocke pas les données en base de données. Veuillez utiliser un utilisateur existant (ex : johnd / m38rmF$) pour vous connecter.`
			);

			// Switch to login screen
			setTimeout(() => {
				setIsLogin(true);
			}, 4000);
		} catch (err: unknown) {
			const errMsg =
				err instanceof Error
					? err.message
					: "Une erreur s'est produite lors de l'inscription.";
			setError(errMsg);
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
				<div className="lg:col-span-4">
					<ProfileCard
						usernameSession={usernameSession}
						userProfile={userProfile}
						onLogout={handleLogout}
					/>
				</div>
				<div className="lg:col-span-8">
					<OrderHistory orders={orders} isLoading={isLoadingOrders} />
				</div>
			</div>
		);
	}

	// Login and Register Forms View
	return (
		<div className="flex animate-in justify-center py-8 duration-300 fade-in">
			<Card className="w-full max-w-md border-border bg-card">
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
						<p className="text-sm leading-normal font-medium text-emerald-600 dark:text-emerald-400">
							{success}
						</p>
					)}

					{isLogin ? (
						<LoginForm
							onSuccess={handleLoginSuccess}
							onError={(msg) => {
								setError(msg);
								setSuccess(null);
							}}
						/>
					) : (
						<RegisterForm
							onSubmit={handleRegister}
							isLoading={isLoading}
							onError={(msg) => setError(msg)}
						/>
					)}
				</CardContent>
				<Separator />
				<CardFooter className="flex justify-center">
					<Button
						variant="link"
						className="cursor-pointer px-0 font-normal"
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
