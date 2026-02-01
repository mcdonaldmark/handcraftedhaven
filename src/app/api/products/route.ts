// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const artisanId = session.user.id; // Use logged-in artisan

    // Parse form data
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString() || "";
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const categoryId = formData.get("categoryId")?.toString();

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "All fields including at least one image URL are required." },
        { status: 400 }
      );
    }

    const imageUrls = formData.getAll("imageUrls") as string[];
    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: "At least one image URL is required." },
        { status: 400 }
      );
    }

    const uniqueUrls = Array.from(new Set(imageUrls));
    const savedImages = uniqueUrls.map((url) => ({ url, alt: name }));

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category: { connect: { id: categoryId } },
        artisan: { connect: { id: artisanId } },
        images: { create: savedImages },
      },
      include: {
        images: true,
        category: true,
        artisan: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
