import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {

    console.log("POSTING REVIEW")

    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId, rating, comment } = await req.json();

        if (!productId || !rating || !comment) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        const newReview = await prisma.review.create({
            data: {
                rating,
                comment,
                productId,
                userId: user.id,
            },
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {


        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: "You have already reviewed this product." },
                    { status: 409 }
                );
            }
        }

        console.error("REVIEW_POST_ERROR", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}