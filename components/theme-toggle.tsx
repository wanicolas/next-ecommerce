"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Avoid hydration mismatch by rendering a placeholder until mounted
	useEffect(() => {
		setTimeout(() => setMounted(true), 0);
	}, []);

	// Click outside handler
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	if (!mounted) {
		return (
			<div className="h-9 w-9 animate-pulse rounded-lg border border-border bg-card/50" />
		);
	}

	const getThemeIcon = () => {
		switch (theme) {
			case "light":
				return <Sun className="h-4.5 w-4.5 fill-amber-500/10 text-amber-500" />;
			case "dark":
				return <Moon className="h-4.5 w-4.5 fill-sky-400/10 text-sky-400" />;
			default:
				return <Laptop className="h-4.5 w-4.5 text-muted-foreground" />;
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-card/30 text-muted-foreground transition-all hover:border-foreground/20 hover:bg-muted hover:text-foreground"
				aria-label="Changer de thème"
				aria-expanded={isOpen}
			>
				{getThemeIcon()}
			</button>

			{isOpen && (
				<div className="absolute right-0 z-50 mt-2 w-32 animate-in overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl duration-150 fade-in slide-in-from-top-2">
					<button
						onClick={() => {
							setTheme("light");
							setIsOpen(false);
						}}
						className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-muted hover:text-foreground ${
							theme === "light"
								? "bg-muted text-foreground"
								: "text-muted-foreground"
						}`}
					>
						<Sun className="h-3.5 w-3.5 text-amber-500" />
						Clair
					</button>
					<button
						onClick={() => {
							setTheme("dark");
							setIsOpen(false);
						}}
						className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-muted hover:text-foreground ${
							theme === "dark"
								? "bg-muted text-foreground"
								: "text-muted-foreground"
						}`}
					>
						<Moon className="h-3.5 w-3.5 text-sky-400" />
						Sombre
					</button>
					<button
						onClick={() => {
							setTheme("system");
							setIsOpen(false);
						}}
						className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-muted hover:text-foreground ${
							theme === "system"
								? "bg-muted text-foreground"
								: "text-muted-foreground"
						}`}
					>
						<Laptop className="h-3.5 w-3.5 text-muted-foreground" />
						Système
					</button>
				</div>
			)}
		</div>
	);
}
