import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

/**
 * 🟢 POST → create or update user (UPSERT)
 */
export async function POST(req) {
  try {
    const body = await req.json()

    const { clerkId, name, email, role, profileComplete } = body

    if (!clerkId) {
      return NextResponse.json(
        { success: false, message: "clerkId required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("student_os")
    const users = db.collection("users")

    const result = await users.updateOne(
      { clerkId },
      {
        $set: {
          clerkId,
          name,
          email,
          role,
          profileComplete,
          lastUpdated: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: "User saved/updated",
      upserted: result.upsertedCount > 0,
      modified: result.modifiedCount,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * 🔵 GET → fetch all users
 */
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("student_os")
    const users = db.collection("users")

    const allUsers = await users
      .find({})
      .sort({ lastUpdated: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      count: allUsers.length,
      users: allUsers,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}