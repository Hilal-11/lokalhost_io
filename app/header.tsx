// app/components/Header.tsx
import { cookies } from "next/headers";
import HeaderClient from "./headerClient";
import { jwtVerify } from "jose";

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: string | null = null;
  let userEmail: string | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      
      user = (payload.username as string) || null;
      userEmail = (payload.email as string) || null;
      
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }

  return (
    <HeaderClient 
      isLoggedIn={!!token && !!user} 
      USER={user} 
      USEREMAIL={userEmail} 
    />
  );
}