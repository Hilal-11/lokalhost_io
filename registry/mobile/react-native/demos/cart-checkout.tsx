import { useState } from "react";
import { useRouter } from "expo-router";
import { CartScreen, type CartItem } from "@/screens/cart-screen";

const INITIAL: CartItem[] = [
  { id: "tote", name: "Everyday Tote", variant: "Graphite · M", price: 89, qty: 1 },
  { id: "pour", name: "Ceramic pour-over", variant: "Sand", price: 38, qty: 2 },
  { id: "cap", name: "Linen cap", variant: "Sage · One size", price: 29, qty: 1 },
];

export default function CartRoute() {
  const router = useRouter();
  const [items, setItems] = useState(INITIAL);

  // usage-start
  return (
    <CartScreen
      items={items}
      onQuantityChange={(id, qty) =>
        setItems((list) => (qty === 0 ? list.filter((i) => i.id !== id) : list.map((i) => (i.id === id ? { ...i, qty } : i))))
      }
      onCheckout={() => router.push("/checkout")}
    />
  );
  // usage-end
}
