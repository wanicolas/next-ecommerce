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
		setMounted(true);
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
			<div className="h-9 w-9 rounded-lg border border-border bg-card/50 animate-pulse" />
		);
	}

	const getThemeIcon = () => {
		switch (theme) {
			case "light":
				return <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500/10" />;
			case "dark":
				return <Moon className="h-4.5 w-4.5 text-sky-400 fill-sky-400/10" />;
			default:
				return <Laptop className="h-4.5 w-4.5 text-muted-foreground" />;
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/30 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
				aria-label="Changer de thème"
				aria-expanded={isOpen}
			>
				{getThemeIcon()}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 z-50 w-32 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
					<button
						onClick={() => {
							setTheme("light");
							setIsOpen(false);
						}}
						className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold hover:bg-muted hover:text-foreground transition-colors cursor-pointer ${
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
						className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold hover:bg-muted hover:text-foreground transition-colors cursor-pointer ${
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
						className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold hover:bg-muted hover:text-foreground transition-colors cursor-pointer ${
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
