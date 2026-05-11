"use client"

import React, { useEffect, useState } from "react"
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Pencil, ShieldCheck, Users, Search, X } from "lucide-react"

function formatDate(dateString) {
  if (!dateString) return "—"
  return new Date(dateString).toLocaleString("en-US", {
    month: "short", day: "2-digit",
    year: "numeric", hour: "2-digit",
    minute: "2-digit", hour12: true,
  })
}

// Mobile card for each user (shown below md breakpoint)
function UserCard({ user, onEdit, onDelete }) {
  return (
    <Card className="mb-3">
      <CardContent className="pt-4 pb-3 px-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              {user.name || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {user.email}
            </p>
          </div>
          <Badge variant={user.profileComplete ? "default" : "destructive"} className="shrink-0 text-xs">
            {user.profileComplete ? "সম্পূর্ণ" : "অসম্পূর্ণ"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs capitalize">
            {user.role}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono truncate max-w-[140px]">
            {user.clerkId}
          </span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {formatDate(user.lastUpdated)}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
              <Pencil className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(user)}>
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 7 }).map((_, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ))
}

function CardSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <Card key={i} className="mb-3">
      <CardContent className="pt-4 pb-3 px-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  ))
}

export default function Page() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" })
  const [query, setQuery] = useState("")

  const filtered = users.filter(u => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.clerkId?.toLowerCase().includes(q)
    )
  })

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/register")
      const data = await res.json()
      if (data.success) setUsers(data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const openEdit = (user) => {
    setSelectedUser(user)
    setEditForm({ name: user.name || "", email: user.email || "", role: user.role || "" })
    setEditOpen(true)
  }

  const openDelete = (user) => {
    setSelectedUser(user)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const res = await fetch(`/api/register/${selectedUser.clerkId}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setUsers(prev => prev.filter(u => u.clerkId !== selectedUser.clerkId))
        setDeleteOpen(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const handleUpdate = async () => {
    try {
      setUpdating(true)
      const res = await fetch(`/api/register/${selectedUser.clerkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (data.success) {
        setUsers(prev => prev.map(u =>
          u.clerkId === selectedUser.clerkId
            ? { ...u, ...editForm, lastUpdated: new Date() }
            : u
        ))
        setEditOpen(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8">

        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl">Student OS Users</CardTitle>
                <CardDescription className="mt-0.5 text-sm">
                  সকল রেজিস্টারকৃত ইউজারদের তথ্য ও অ্যাক্টিভিটি
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats + Search row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2 shrink-0">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {query ? (
                <>
                  <span className="font-semibold text-foreground">{filtered.length}</span>
                  <span> / {users.length} ইউজার</span>
                </>
              ) : (
                <>
                  মোট ইউজার:{" "}
                  <span className="font-semibold text-foreground">{users.length}</span>
                </>
              )}
            </span>
          </div>

          {/* Search input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="নাম, ইমেইল, রোল দিয়ে খুঁজুন..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-9 pr-9 h-9 text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="pl-5">নাম</TableHead>
                    <TableHead>ক্লার্ক আইডি</TableHead>
                    <TableHead>ইমেইল</TableHead>
                    <TableHead>রোল</TableHead>
                    <TableHead>প্রোফাইল</TableHead>
                    <TableHead>আপডেট</TableHead>
                    <TableHead className="text-right pr-5">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeleton />
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                        কোনো ইউজার পাওয়া যায়নি
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                        "<span className="text-foreground font-medium">{query}</span>" — কোনো ফলাফল নেই
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map(user => (
                      <TableRow key={user._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium pl-5">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {user.clerkId}
                        </TableCell>
                        <TableCell className="text-sm">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize text-xs">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.profileComplete ? "default" : "destructive"} className="text-xs">
                            {user.profileComplete ? "সম্পূর্ণ" : "অসম্পূর্ণ"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(user.lastUpdated)}
                        </TableCell>
                        <TableCell className="text-right pr-5">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => openEdit(user)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => openDelete(user)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {loading ? (
            <CardSkeleton />
          ) : users.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground text-sm">
                কোনো ইউজার পাওয়া যায়নি
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                "<span className="text-foreground font-medium">{query}</span>" — কোনো ফলাফল নেই
              </CardContent>
            </Card>
          ) : (
            filtered.map(user => (
              <UserCard key={user._id} user={user} onEdit={openEdit} onDelete={openDelete} />
            ))
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>ইউজার ডিলিট করবেন?</DialogTitle>
            <DialogDescription>
              এই অ্যাকশন পূর্বাবস্থায় ফেরানো যাবে না।
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
            <p><span className="text-muted-foreground">Name:</span>{" "}<span className="font-medium">{selectedUser?.name}</span></p>
            <p><span className="text-muted-foreground">Email:</span>{" "}<span className="font-medium">{selectedUser?.email}</span></p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>ইউজার আপডেট করুন</DialogTitle>
            <DialogDescription>
              নিচের তথ্য পরিবর্তন করে Save করুন।
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <Input
              placeholder="Name"
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={editForm.email}
              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
            />
            <Input
              placeholder="Role"
              value={editForm.role}
              onChange={e => setEditForm({ ...editForm, role: e.target.value })}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}