import nodemailer from "nodemailer";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";
export const sendMail = async({ email , emailType , userId }:any) => {
    try{
        const hashedToken = await bcrypt.hash(userId.toString(), 10);
        
        if(emailType === "Varify") {
            await User.findByIdAndUpdate(userId, {
               $set:{
                 varifyToken: hashedToken,
                 varifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
               }
            });
            // Generate varification link
            const varifyLink = `${process.env.DOMAIN}/varifyEmail?token=${userId}`;
            console.log("Varify Link:", varifyLink);
        }else if(emailType === "Reset") {
            await User.findByIdAndUpdate(userId, {
                $set:{
                    forgetPasswordToken: hashedToken,
                    forgetPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiry
                }
            });
            // Generate reset password link
            const resetLink = `${process.env.DOMAIN}/resetPassword?token=${userId}`;
            console.log("Reset Link:", resetLink);
        }   

        // Create a test account or replace with real credentials.
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "72ad763ce39297", // ENV VARIABLES
                pass: "c12aab314ce714", // ENV VARIABLES
            },
        });
        
        const mailOptions = {
            from: 'hilalahmadcodedev123@gmail.com',
            to: email,
            subject: emailType === "Varify" ? "Varify your email" : "reset your password",
            html: `<p>
                ${emailType === "Varify" ? `Click here <a href="${process.env.DOMAIN}/varifyEmail?token=${hashedToken}"></a> to varify your email`: `Click here <a href="${process.env.DOMAIN}/resetPassword?token=${hashedToken}"></a> to reset your password`} 
            </p>`, 
        }

        const mailResponse = transporter.sendMail(mailOptions)
        return mailResponse;


    }catch(err:any) {
        throw new Error(err.message);
    }
}