"use client"

import React, { useEffect, useState } from "react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(dateString) {
  if (!dateString) return "-"

  const date = new Date(dateString)

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format
  })
}

export default function Page() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/register")
        const data = await res.json()

        setUsers(data.users || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-4 md:p-8 max-w-6xl ">

      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          স্টুডেন্ট ওএস ইউজার ম্যানেজমেন্ট
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          সকল রেজিস্টারকৃত ইউজারদের তথ্য ও অ্যাক্টিভিটি ট্র্যাকিং
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">

        <Table>
          <TableCaption className="py-4">
            স্টুডেন্ট ওএস প্ল্যাটফর্মে রেজিস্টার করা ইউজারদের তালিকা
          </TableCaption>

          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>নাম</TableHead>
              <TableHead>ক্লার্ক আইডি</TableHead>
              <TableHead>ইমেইল</TableHead>
              <TableHead>রোল</TableHead>
              <TableHead>প্রোফাইল</TableHead>
              <TableHead className="text-right">সর্বশেষ আপডেট</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  লোড হচ্ছে...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  কোনো ইউজার পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} className="hover:bg-muted/30">

                  <TableCell className="font-medium">
                    {user.name}
                  </TableCell>

                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {user.clerkId}
                  </TableCell>

                  <TableCell>
                    {user.email}
                  </TableCell>

                  <TableCell>
                    {user.role || "স্টুডেন্ট"}
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        user.profileComplete
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {user.profileComplete ? "সম্পূর্ণ" : "অসম্পূর্ণ"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(user.lastUpdated)}
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

      </div>
    </div>
  )
}