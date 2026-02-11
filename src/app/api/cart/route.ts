import { NextResponse } from "next/server";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}


let carts: Map<string, CartItem[]> = new Map();

export async function GET(req: Request) {
  const sessionId = req.headers.get("x-session-id");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }


  const currentCart = carts.get(sessionId) || [];
  return NextResponse.json(currentCart);
}

export async function POST(req: Request) {
  try {
    const sessionId = req.headers.get("x-session-id");
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const { id, name, price, imageUrl } = await req.json();


    if (!carts.has(sessionId)) {
      carts.set(sessionId, []);
    }

    const currentCart = carts.get(sessionId)!;
    const existing = currentCart.find((item) => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      currentCart.push({ id, name, price, quantity: 1, imageUrl });
    }

    return NextResponse.json({ message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const sessionId = req.headers.get("x-session-id");
    if (!sessionId) return NextResponse.json({ error: "Required" }, { status: 400 });

    const { productId } = await req.json();
    const currentCart = carts.get(sessionId) || [];

    const updatedCart = currentCart.filter((item) => item.id !== productId);
    carts.set(sessionId, updatedCart);

    return NextResponse.json({ message: "Item removed" });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}