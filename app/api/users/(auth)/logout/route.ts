import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"


await dbConnect()
export const POST = async (request: NextRequest) => {
    await dbConnect();
    try {
        const response = NextResponse.json({
            message: "User logged out successfully",
            success: true,
            status: 200,
        })
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        return response;

    }catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Internal server error" + error.message }),
            { status: 500 }
        )
    }
}