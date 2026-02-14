import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        artisan: {
          select: {
            name: true,
            id: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const result = products.map((p) => ({
      ...p,
      price: Number(p.price),
      reviewCount: p.reviews.length || 0,
      averageRating:
        p.reviews.length > 0
          ? p.reviews.reduce((sum, review) => sum + review.rating, 0) /
            p.reviews.length
          : 0,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "artisan") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, price, categoryId, images } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: new Prisma.Decimal(price), // 🔥 important
        categoryId,
        artisanId: session.user.id,
        images: {
          create:
            images?.map((url: string) => ({
              url,
            })) || [],
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("PRODUCT_CREATE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
