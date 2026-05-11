import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

/**
 * 🔵 GET SINGLE USER
 */
export async function GET(req, { params }) {
  try {
    const { clerkId } = params

    const client = await clientPromise

    const db = client.db("student_os")

    const user = await db.collection("users").findOne({
      clerkId,
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user",
      },
      { status: 500 }
    )
  }
}

/**
 * 🟨 UPDATE SINGLE USER
 */
export async function PATCH(req, { params }) {
  try {
    const { clerkId } = params

    const body = await req.json()

    const client = await clientPromise

    const db = client.db("student_os")

    await db.collection("users").updateOne(
      {
        clerkId,
      },
      {
        $set: {
          ...body,
          lastUpdated: new Date(),
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
      },
      { status: 500 }
    )
  }
}

/**
 * 🟥 DELETE SINGLE USER
 */
export async function DELETE(req, { params }) {
  try {
    const { clerkId } = params

    const client = await clientPromise

    const db = client.db("student_os")

    await db.collection("users").deleteOne({
      clerkId,
    })

    return NextResponse.json({
      success: true,
      message: "User deleted",
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      { status: 500 }
    )
  }
}