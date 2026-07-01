import { Geist_Mono, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/components/cart-context";
import { WishlistProvider } from "@/components/wishlist-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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
			<body className="flex min-h-dvh flex-col bg-background text-foreground">
				<ThemeProvider>
					<WishlistProvider>
						<CartProvider>
							<Header />
							<main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
								{children}
							</main>
							<Footer />
						</CartProvider>
					</WishlistProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
