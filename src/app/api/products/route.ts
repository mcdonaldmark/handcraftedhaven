import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        artisan: {
          select: {
            name: true,
            id: true
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
      averageRating: p.reviews.length > 0
        ? p.reviews.reduce((sum, review) => sum + review.rating, 0) / p.reviews.length
        : 0,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
