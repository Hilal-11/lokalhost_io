import { cookies } from "next/headers";
import HeaderClient from "./headerClient";

export default async function Header() {

  const cookieStore = await cookies(); // ✅ AWAIT
  const token = cookieStore.get("token")?.value;

  return <HeaderClient isLoggedIn={!!token}/>;
}