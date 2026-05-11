import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

/**
 * 🟦 GET ALL USERS
 */
export async function GET() {
  try {
    const client = await clientPromise

    const db = client.db("student_os")

    const users = await db
      .collection("users")
      .find({})
      .sort({ lastUpdated: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 }
    )
  }
}

/**
 * 🟩 CREATE OR UPDATE USER
 */
export async function POST(req) {
  try {
    const body = await req.json()

    const {
      clerkId,
      name,
      email,
      role = "student",
      profileComplete = false,
    } = body

    if (!clerkId || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "clerkId and email required",
        },
        { status: 400 }
      )
    }

    const client = await clientPromise

    const db = client.db("student_os")

    const users = db.collection("users")

    const existingUser = await users.findOne({
      clerkId,
    })

    if (existingUser) {
      await users.updateOne(
        { clerkId },
        {
          $set: {
            name,
            email,
            role,
            profileComplete,
            lastUpdated: new Date(),
          },
        }
      )

      return NextResponse.json({
        success: true,
        message: "User updated",
      })
    }

    await users.insertOne({
      clerkId,
      name,
      email,
      role,
      profileComplete,
      createdAt: new Date(),
      lastUpdated: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "User created",
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}

/**
 * 🟥 BULK DELETE USERS
 */
export async function DELETE(req) {
  try {
    const body = await req.json()

    const { clerkIds } = body

    if (!clerkIds || !Array.isArray(clerkIds)) {
      return NextResponse.json(
        {
          success: false,
          message: "clerkIds array required",
        },
        { status: 400 }
      )
    }

    const client = await clientPromise

    const db = client.db("student_os")

    const result = await db.collection("users").deleteMany({
      clerkId: {
        $in: clerkIds,
      },
    })

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Bulk delete failed",
      },
      { status: 500 }
    )
  }
}