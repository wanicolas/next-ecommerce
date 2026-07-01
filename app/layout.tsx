import { Geist_Mono, Inter, Montserrat } from "next/font/google";
import Link from "next/link";

import { User } from "lucide-react";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/components/cart-context";
import { CartIcon } from "@/components/cart-icon";

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
				<CartProvider>
					<header className="sticky top-0 z-10 mx-auto mb-16 w-full max-w-6xl bg-white/75 px-4 pt-4 pb-4 backdrop-blur sm:px-12 sm:pt-8 md:mb-28 lg:mb-36 dark:bg-black/75">
						<nav className="flex items-center justify-between gap-3">
							<Link href="/" className="text-2xl font-bold">
								Ecommerce™
							</Link>

							<div className="flex items-center gap-3">
								<Link
									href="/products"
									className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm font-medium"
								>
									Produits
								</Link>
								<CartIcon />
								<Link
									href="/compte"
									className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
									aria-label="Mon compte"
								>
									<User className="h-5 w-5" />
								</Link>
							</div>
						</nav>
					</header>
					<ThemeProvider>
						<main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-12">
							{children}
						</main>
					</ThemeProvider>
					<footer className="z-10 mx-auto mt-16 flex w-full max-w-6xl items-center justify-between gap-x-8 gap-y-4 px-4 pt-4 pb-4 backdrop-blur sm:px-12 sm:pt-8 md:mb-28 lg:mb-36 text-sm text-muted-foreground">
						<Link href="/about" className="hover:text-foreground transition-colors">À propos</Link>
						<Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
						<Link href="/terms" className="hover:text-foreground transition-colors">Termes et conditions</Link>
						<Link href="/returns" className="hover:text-foreground transition-colors">Retours</Link>
						<Link href="/legals" className="hover:text-foreground transition-colors">Mentions légales</Link>
					</footer>
				</CartProvider>
			</body>
		</html>
	);
}
