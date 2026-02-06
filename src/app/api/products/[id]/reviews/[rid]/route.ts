import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();


export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ rid: string }> }
) {

    const { rid } = await context.params;

    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }



        if (!rid) {
            return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
        }

        const review = await prisma.review.findUnique({
            where: { id: rid },
        });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        if (review.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.review.delete({
            where: { id: rid },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("REVIEW_DELETE_ERROR", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}