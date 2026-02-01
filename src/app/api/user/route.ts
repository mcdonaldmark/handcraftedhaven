import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        const body = await req.json();
        const { name, shopName, bio, password, id } = body;

        console.log(session, body);

        if (!session || !id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const updateData: any = {
            name,
            shopName,
            bio,
        };

        if (password && password.trim() !== "") {
            updateData.password = await hash(password, 12);
        }

        const updatedUser = await prisma.user.update({
            where: { id: body.id },
            data: updateData,
        });

        return NextResponse.json({
            message: "Profile updated",
            user: {
                name: updatedUser.name,
                shopName: updatedUser.shopName,
                bio: updatedUser.bio,
            }
        });

    } catch (error: any) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}