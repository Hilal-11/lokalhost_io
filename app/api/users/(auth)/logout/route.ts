// app/api/users/(auth)/logout/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export const dynamic = 'force-dynamic'; // ✅ prevents static pre-render at build time

export const POST = async (request: NextRequest) => {
    try {
        await dbConnect(); // ✅ only call inside the handler, not at top level
        
        const response = NextResponse.json({
            message: "User logged out successfully",
            success: true,
            status: 200,
        });
        
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        
        return response;

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Internal server error: " + error.message }),
            { status: 500 }
        );
    }
}