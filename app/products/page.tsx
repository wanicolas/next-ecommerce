import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function Page() {
	const data = await fetch("https://fakestoreapi.com/products");
	const products: {
		id: number;
		title: string;
		price: number;
		description: string;
		category: string;
		image: string;
	}[] = await data.json();
	return (
		<div>
			<h1 className="mb-8 text-3xl font-semibold">Produits</h1>

			<div className="grid grid-cols-3 gap-x-8 gap-y-12">
				{products.map((product) => (
					<Link href={"/products/" + product.id} key={product.id}>
						<Card key={product.id}>
							<img
								src={product.image}
								alt=""
								className="h-60 object-contain p-4"
							/>
							<CardHeader>
								<CardTitle>{product.title}</CardTitle>
								<CardAction>
									<Badge variant="outline">{product.category}</Badge>
								</CardAction>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
