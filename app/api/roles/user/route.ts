import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();

        const data = await db.role.findUnique({             
            where: {
                id: session?.user?.role?.id
            }
        });
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}