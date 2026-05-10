"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    const registerUser = async () => {
      // 🔐 যদি লগইন না থাকে → sign-in এ পাঠাও
      if (isLoaded && !user) {
        router.push("/sign-in")
        return
      }

      if (!user) return

      try {
        // 🗄️ backend এ user save / update
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            role: "student",
            profileComplete: true,
          }),
        })

        const data = await res.json()
        console.log("রেজিস্ট্রেশন সফল:", data)

        // 🚀 সফল হলে হোম পেজে পাঠাও
        router.push("/")
      } catch (error) {
        console.error("ত্রুটি হয়েছে:", error)
      }
    }

    if (isLoaded) {
      registerUser()
    }
  }, [user, isLoaded, router])

  return (
    <div className="h-screen flex items-center justify-center">
      <p>অ্যাকাউন্ট সেটআপ হচ্ছে...</p>
    </div>
  )
}