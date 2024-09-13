import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { colorid: string}}
) {
    try {

        if (!params.colorid) {
            return new NextResponse("Color id is required", {status: 400})
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorid,
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_GET]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: {storeid: string, colorid: string}}
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
        
        if (!params.colorid) {
            return new NextResponse("Color id is required", {status: 400})
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

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorid,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_PATCH]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: {storeid: string, colorid: string}}
) {
    try {
        const{ userId } = auth();

        if (!userId) {
            return new NextResponse("Unathenticated", {status: 401})
        }

        if (!params.colorid) {
            return new NextResponse("Color id is required", {status: 400})
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorid,
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_DELETE]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

