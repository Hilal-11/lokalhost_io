// app/login/page.tsx
import { Suspense } from "react"
import LoginPage from "./LoginClient"

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  )
}