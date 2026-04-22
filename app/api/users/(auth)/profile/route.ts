import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/user';
import dbConnect from '@/lib/dbConnect';
import Jwt from 'jsonwebtoken';



await dbConnect();

export const GET = async (request: NextRequest) => {
    // extract token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try{
        const decodeToken: any = Jwt.verify(token , process.env.JWT_SECRET!);
        const user = await User.findById(decodeToken.id).select('-password');
        if(!user){
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({message: "User profile fetched successfully", user: user}, { status: 200 })
    }catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}