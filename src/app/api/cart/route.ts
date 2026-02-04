import { NextResponse } from "next/server";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Temporary in-memory cart (replace with DB for production)
let cart: CartItem[] = [];

export async function GET() {
  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  try {
    const { id, name, price, imageUrl } = await req.json();

    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1, imageUrl });
    }

    return NextResponse.json({ message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();
    cart = cart.filter((item) => item.id !== productId);
    return NextResponse.json({ message: "Item removed" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
