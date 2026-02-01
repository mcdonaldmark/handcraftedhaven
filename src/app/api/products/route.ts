import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString() || "";
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const categoryId = formData.get("categoryId")?.toString();
    const artisanId = formData.get("artisanId")?.toString();

    if (!name || !price || !categoryId || !artisanId) {
      return NextResponse.json(
        { error: "All fields including at least one image are required." },
        { status: 400 }
      );
    }

    const blobs = formData.getAll("images") as Blob[];
    if (blobs.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required." },
        { status: 400 }
      );
    }

    const uniqueBlobs = blobs.filter(
      (blob, index, self) =>
        index === self.findIndex((b) => (b as any).name === (blob as any).name)
    );

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const savedImages = [];

    for (const imageFile of uniqueBlobs) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = `${Date.now()}-${name.replace(/\s+/g, "-")}-${Math.floor(
        Math.random() * 10000
      )}.png`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, buffer);

      savedImages.push({ url: `/uploads/${fileName}`, alt: name });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category: { connect: { id: categoryId } },
        artisan: { connect: { id: artisanId } },
        images: {
          create: savedImages,
        },
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
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
