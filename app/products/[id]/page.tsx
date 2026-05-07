export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const data = await fetch("https://fakestoreapi.com/products/" + id);
	const product: {
		id: number;
		title: string;
		price: number;
		description: string;
		category: string;
		image: string;
	} = await data.json();

	return (
		<div>
			<p>{product.title}</p>
			<p>{product.price}</p>
			<p>{product.description}</p>
			<img src={product.image} alt={product.title} />
		</div>
	);
}
