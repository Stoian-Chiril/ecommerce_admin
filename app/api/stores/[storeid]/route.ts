import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    { params }: { params: {storeid: string}}
) {
    try {
        const{ userId } = auth();

        const body = await req.json();

        const {name} = body;

        if (!userId) {
            return new NextResponse("Unathenticated", {status: 401})
        }

        if (!name) {
            return new NextResponse("Name is required", {status: 400})
        }
        
        if (!params.storeid) {
            return new NextResponse("Store id is required", {status: 400})
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeid,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORE_PATCH]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: {storeid: string}}
) {
    try {
        const{ userId } = auth();

        if (!userId) {
            return new NextResponse("Unathenticated", {status: 401})
        }

        if (!params.storeid) {
            return new NextResponse("Store id is required", {status: 400})
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeid,
                userId
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORE_DELETE]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function GET(req: Request, { params }: { params: { storeid: string } }) {
  try {
    const store = await prismadb.store.findUnique({
      where: { id: params.storeid },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}