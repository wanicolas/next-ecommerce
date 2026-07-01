"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistIcon } from "@/components/wishlist-icon";
import { CartIcon } from "@/components/cart-icon";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	// Close mobile menu when pathname changes
	useEffect(() => {
		setTimeout(() => setIsOpen(false), 0);
	}, [pathname]);

	const navLinks = [
		{ href: "/", label: "Accueil" },
		{ href: "/products", label: "Boutique" },
		{ href: "/favoris", label: "Favoris" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
				>
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
						<ShoppingBag className="h-5 w-5" />
					</div>
					<span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
						Aura<span className="text-primary">Shop</span>
					</span>
				</Link>

				{/* Desktop Navigation Links */}
				<nav className="hidden items-center gap-6 md:flex">
					{navLinks.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={`text-sm font-semibold transition-colors hover:text-foreground ${
									isActive ? "text-foreground" : "text-muted-foreground"
								}`}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>

				{/* Actions */}
				<div className="flex items-center gap-2 sm:gap-3">
					<div className="flex items-center gap-1 sm:gap-2">
						<WishlistIcon />
						<CartIcon />
						<Link
							href="/compte"
							className={`rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
								pathname === "/compte" ? "bg-muted text-foreground" : ""
							}`}
							aria-label="Mon compte"
						>
							<User className="h-5 w-5" />
						</Link>
						<ThemeToggle />
					</div>

					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsOpen(!isOpen)}
						className="cursor-pointer md:hidden"
						aria-label="Menu"
					>
						{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>
			</div>

			{/* Mobile Drawer Navigation */}
			{isOpen && (
				<div className="absolute top-16 left-0 z-45 w-full animate-in border-b border-border bg-background p-6 shadow-xl duration-200 slide-in-from-top-5 md:hidden">
					<nav className="flex flex-col gap-4">
						{navLinks.map((link) => {
							const isActive = pathname === link.href;
							return (
								<Link
									key={link.href}
									href={link.href}
									className={`rounded-lg p-2 text-sm font-semibold transition-colors hover:bg-muted ${
										isActive
											? "bg-muted text-foreground"
											: "text-muted-foreground"
									}`}
								>
									{link.label}
								</Link>
							);
						})}
					</nav>
				</div>
			)}
		</header>
	);
}
