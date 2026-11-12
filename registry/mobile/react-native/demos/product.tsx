import { useRouter } from "expo-router";
import { ProductScreen, type Product } from "@/screens/product-screen";

const TOTE: Product = {
  name: "Everyday Tote",
  price: 89,
  rating: 4.8,
  reviews: 1204,
  images: [
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900",
  ],
  colors: [
    { name: "Graphite", hex: "#3f3f46" },
    { name: "Sand", hex: "#d6c7a8" },
    { name: "Sage", hex: "#8fa98a" },
  ],
  sizes: ["S", "M", "L", "XL"],
  description: "Water-resistant canvas, a padded laptop sleeve and a magnetic closure.",
};

export default function ProductRoute() {
  const router = useRouter();

  // usage-start
  return (
    <ProductScreen
      product={TOTE}
      onBack={() => router.back()}
      onAddToCart={({ color, size }) => {
        console.log("add", TOTE.name, color, size);
        router.push("/cart");
      }}
    />
  );
  // usage-end
}
