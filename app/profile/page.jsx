"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"

export default function Page() {
  const { user } = useUser()

  useEffect(() => {
    const registerUser = async () => {
      if (!user) return

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // 🧑 Clerk data
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,

          // 📦 extra app data
          role: "student",
          profileComplete: true,
        }),
      })

      const data = await res.json()
      console.log("Registered:", data)
    }

    registerUser()
  }, [user])

  return <div>Registering user...</div>
}