/**
 * Utilitaires de gestion des cookies côté client (session utilisateur).
 */

/**
 * Récupère la valeur d'un cookie par son nom.
 * @param name Nom du cookie à récupérer.
 * @returns La valeur du cookie sous forme de chaîne, ou null s'il n'existe pas ou si exécuté côté serveur.
 */
export function getCookie(name: string): string | null {
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

/**
 * Définit ou met à jour un cookie sécurisé.
 * @param name Nom du cookie.
 * @param value Valeur du cookie.
 * @param days Durée de validité en jours (par défaut 7 jours).
 */
export function setCookie(name: string, value: string, days = 7) {
	if (typeof document === "undefined") return;
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Strict; Secure`;
}

/**
 * Supprime un cookie en expirant sa date de validité.
 * @param name Nom du cookie à supprimer.
 */
export function eraseCookie(name: string) {
	if (typeof document === "undefined") return;
	document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure`;
}
