import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { sizeid: string}}
) {
    try {

        if (!params.sizeid) {
            return new NextResponse("Size id is required", {status: 400})
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeid,
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_GET]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: {storeid: string, sizeid: string}}
) {
    try {
        const{ userId } = auth();

        const body = await req.json();

        const {name , value} = body;

        if (!userId) {
            return new NextResponse("Unathenticated", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if(!value) {
            return new NextResponse("Value is required", {status: 400});
        }
        
        if (!params.sizeid) {
            return new NextResponse("Size id is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeid,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeid,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_PATCH]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: {storeid: string, sizeid: string}}
) {
    try {
        const{ userId } = auth();

        if (!userId) {
            return new NextResponse("Unathenticated", {status: 401})
        }

        if (!params.sizeid) {
            return new NextResponse("Size id is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeid,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeid,
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_DELETE]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

