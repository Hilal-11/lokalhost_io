import { useRouter } from "expo-router";
import { SignInScreen } from "@/screens/sign-in-screen";

// app/sign-in.tsx (Expo Router). Swap the handlers for your auth provider.
export default function SignIn() {
  const router = useRouter();

  // usage-start
  return (
    <SignInScreen
      onSubmit={async (email, password) => {
        const res = await fetch("https://api.example.com/auth/sign-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error("Wrong email or password.");
        router.replace("/(tabs)");
      }}
      onSocial={(provider) => console.log("sign in with", provider)}
      onForgotPassword={() => router.push("/forgot-password")}
      onSignUp={() => router.push("/sign-up")}
    />
  );
  // usage-end
}
