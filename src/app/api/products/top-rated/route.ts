import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const topRatedGroups = await prisma.review.groupBy({
            by: ['productId'],
            _avg: {
                rating: true,
            },
            _count: {
                productId: true,
            },
            orderBy: {
                _avg: {
                    rating: 'desc',
                },
            },
            take: 3,
        });

        if (topRatedGroups.length === 0) {
            return NextResponse.json([]);
        }

        const productIds = topRatedGroups.map((group) => group.productId);

        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
            },
            include: {
                artisan: true,
                images: { take: 1 },
                category: true,
                _count: {
                    select: { reviews: true },
                },
            },
        });

        const sortedProducts = products.map(product => {
            const group = topRatedGroups.find(g => g.productId === product.id);
            return {
                ...product,
                avgRating: group?._avg.rating || 0
            };
        }).sort((a, b) => b.avgRating - a.avgRating);

        return NextResponse.json(sortedProducts);

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch top products" }, { status: 500 });
    }
}