"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
	return (
		<footer className="w-full border-t border-border/40 bg-card py-16 text-sm text-muted-foreground">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-16">
					{/* Col 1: Brand Info */}
					<div className="space-y-4">
						<Link
							href="/"
							className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
						>
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
								<ShoppingBag className="h-4 w-4" />
							</div>
							<span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
								Aura<span className="text-primary">Shop</span>
							</span>
						</Link>
						<p className="text-xs leading-relaxed text-muted-foreground">
							Sélection exclusive d&apos;articles de mode, joaillerie raffinée
							et technologies de pointe au meilleur prix.
						</p>
						<div className="flex items-center gap-3 pt-2">
							<a
								href="#"
								className="text-muted-foreground transition-colors hover:text-foreground"
								aria-label="Facebook"
							>
								<svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
									<path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
								</svg>
							</a>
							<a
								href="#"
								className="text-muted-foreground transition-colors hover:text-foreground"
								aria-label="Instagram"
							>
								<svg
									className="h-4 w-4 fill-none stroke-current stroke-2"
									viewBox="0 0 24 24"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
								</svg>
							</a>
							<a
								href="#"
								className="text-muted-foreground transition-colors hover:text-foreground"
								aria-label="Twitter"
							>
								<svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
							<a
								href="#"
								className="text-muted-foreground transition-colors hover:text-foreground"
								aria-label="GitHub"
							>
								<svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.48-10-10-10z"
									/>
								</svg>
							</a>
						</div>
					</div>

					{/* Col 2: Shop Links */}
					<div className="space-y-3">
						<h4 className="font-heading text-xs font-bold tracking-wider text-foreground uppercase">
							Boutique
						</h4>
						<ul className="space-y-2 text-xs">
							<li>
								<Link
									href="/products?category=electronics"
									className="transition-colors hover:text-foreground"
								>
									Électronique
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=jewelery"
									className="transition-colors hover:text-foreground"
								>
									Bijoux
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=men's clothing"
									className="transition-colors hover:text-foreground"
								>
									Mode Homme
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=women's clothing"
									className="transition-colors hover:text-foreground"
								>
									Mode Femme
								</Link>
							</li>
						</ul>
					</div>

					{/* Col 3: Legals */}
					<div className="space-y-3">
						<h4 className="font-heading text-xs font-bold tracking-wider text-foreground uppercase">
							Informations
						</h4>
						<ul className="space-y-2 text-xs">
							<li>
								<Link
									href="/about"
									className="transition-colors hover:text-foreground"
								>
									À propos
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="transition-colors hover:text-foreground"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="transition-colors hover:text-foreground"
								>
									Conditions Générales
								</Link>
							</li>
							<li>
								<Link
									href="/legals"
									className="transition-colors hover:text-foreground"
								>
									Mentions Légales
								</Link>
							</li>
						</ul>
					</div>

					{/* Col 4: Newsletter */}
					<div className="space-y-3">
						<h4 className="font-heading text-xs font-bold tracking-wider text-foreground uppercase">
							Newsletter
						</h4>
						<p className="text-xs leading-relaxed text-muted-foreground">
							Inscrivez-vous pour recevoir nos promotions et nouveautés.
						</p>
						<form
							className="flex gap-2 pt-1"
							onSubmit={(e) => e.preventDefault()}
						>
							<Input
								type="email"
								placeholder="Votre adresse email"
								className="h-9 border-border/80 text-xs"
								required
							/>
							<Button
								type="submit"
								size="sm"
								className="h-9 cursor-pointer font-semibold"
							>
								S&apos;abonner
							</Button>
						</form>
					</div>
				</div>

				<Separator className="my-10 border-border/40" />

				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} AuraShop. Tous droits réservés.
					</p>
					{/* Mock Payment Badges */}
					<div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
						<span className="rounded-md border border-border/85 bg-background px-2 py-0.5 text-[9px] tracking-wide uppercase shadow-sm">
							Visa
						</span>
						<span className="rounded-md border border-border/85 bg-background px-2 py-0.5 text-[9px] tracking-wide uppercase shadow-sm">
							Mastercard
						</span>
						<span className="rounded-md border border-border/85 bg-background px-2 py-0.5 text-[9px] tracking-wide uppercase shadow-sm">
							Paypal
						</span>
						<span className="rounded-md border border-border/85 bg-background px-2 py-0.5 text-[9px] tracking-wide uppercase shadow-sm">
							Apple Pay
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
