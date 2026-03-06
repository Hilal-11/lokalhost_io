import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/helpers/mailer"

await dbConnect();

export const GET = async (request: Request) => {
    try{
        await dbConnect();
        const users = await User.find({});
        return NextResponse.json({
            message: "Users fetched successfully",
            users: users,
            success: true,
            status: 200
        })
    }catch(error:any){
        return NextResponse.json({
            message: "Error fetching users",
            error: error.message,
            success: false,
            status: 500
        })
    }
}

export const POST = async (request: NextRequest) => {
    const body = await request.json();
    await dbConnect();

    try{
        const userExists = await User.findOne({ email: body.email })
        if(userExists) {
            return new NextResponse(JSON.stringify({ message: "User already exists" }), { status: 500 })
        }   

        const saltRounds = 10;
        body.password = await bcrypt.hash(body.password , saltRounds);
        const user = new User(body)
        await user.save();

        // Send Varification Email
        await sendMail({ email: user.email, emailType: "Varify" , userId: user._id });

        return new NextResponse(
            JSON.stringify({ message: "new user created successfully" , user: user}),
            {status: 200}
        )
    }catch(error:any) {
        return new NextResponse(
            JSON.stringify({ message: "new user created successfully"+ error.message}),
            {status: 500}
        )
    }
}