import { NextResponse } from  "next/server"
import { prisma } from  "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fullName, email, password, role = "STUDENT", phone } = body

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, and password are required." },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      )
    }

    // Split name into firstName and lastName
    const nameParts = fullName.trim().split(" ")
    const firstName = nameParts[0] || "User"
    const lastName = nameParts.slice(1).join(" ") || ""

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10)

    // Map role enum string
    const roleUpper = role.toUpperCase() === "EDUCATOR" ? "EDUCATOR" : "STUDENT"

    // Create User record in DB
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role: roleUpper,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      {
        message: "Account created successfully",
        user
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration Error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create account due to server error" },
      { status: 500 }
    )
  }
}
