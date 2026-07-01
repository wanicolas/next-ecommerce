import { Geist_Mono, Inter, Montserrat } from "next/font/google";
import Link from "next/link";

import { User } from "lucide-react";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/components/cart-context";
import { CartIcon } from "@/components/cart-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { WishlistProvider } from "@/components/wishlist-context";
import { WishlistIcon } from "@/components/wishlist-icon";

const montserratHeading = Montserrat({
	subsets: ["latin"],
	variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="fr"
			suppressHydrationWarning
			className={cn(
				"antialiased",
				fontMono.variable,
				"font-sans",
				inter.variable,
				montserratHeading.variable
			)}
		>
			<body className="flex min-h-dvh flex-col">
				<ThemeProvider>
					<WishlistProvider>
						<CartProvider>
							<header className="sticky top-0 z-10 mx-auto mb-16 w-full max-w-6xl bg-white/75 px-4 pt-4 pb-4 backdrop-blur sm:px-12 sm:pt-8 md:mb-28 lg:mb-36 dark:bg-black/75">
								<nav className="flex items-center justify-between gap-3">
									<Link href="/" className="text-2xl font-bold">
										Ecommerce™
									</Link>

									<div className="flex items-center gap-3">
										<Link
											href="/products"
											className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										>
											Produits
										</Link>
										<WishlistIcon />
										<CartIcon />
										<Link
											href="/compte"
											className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
											aria-label="Mon compte"
										>
											<User className="h-5 w-5" />
										</Link>
										<ThemeToggle />
									</div>
								</nav>
							</header>
							<main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-12">
								{children}
							</main>
							<footer className="z-10 mx-auto mt-16 flex w-full max-w-6xl items-center justify-between gap-x-8 gap-y-4 px-4 pt-4 pb-4 text-sm text-muted-foreground backdrop-blur sm:px-12 sm:pt-8 md:mb-28 lg:mb-36">
								<Link
									href="/about"
									className="transition-colors hover:text-foreground"
								>
									À propos
								</Link>
								<Link
									href="/contact"
									className="transition-colors hover:text-foreground"
								>
									Contact
								</Link>
								<Link
									href="/terms"
									className="transition-colors hover:text-foreground"
								>
									Termes et conditions
								</Link>
								<Link
									href="/returns"
									className="transition-colors hover:text-foreground"
								>
									Retours
								</Link>
								<Link
									href="/legals"
									className="transition-colors hover:text-foreground"
								>
									Mentions légales
								</Link>
							</footer>
						</CartProvider>
					</WishlistProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
