import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


await dbConnect()

export const POST = async (request: NextRequest) => {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    try{
        const user = await User.findOne({ email }).select("+password");
        if(!user) {
            return new NextResponse(JSON.stringify({ message: "Incorrect Email and password" }), { status: 400 })
        }   
        const isPasswordValid = await bcrypt.compare(password , user.password);
        if(!isPasswordValid){
            return new NextResponse(JSON.stringify({ message: "Incorrect Email and password" }), { status: 400 })
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        )

        const { password: _, ...userData } = user.toObject();

        const response = NextResponse.json({
            message: "User logged in successfully",
            success: true,
            status: 200,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax", // or "none" if cross-origin (with secure)
            path: "/", // important
        })
        return response;

    }catch(error:any) {
        return new NextResponse(
            JSON.stringify({ message: "internal server error"+ error.message}),
            {status: 500}
        )
    }
}