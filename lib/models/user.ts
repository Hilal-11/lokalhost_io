import { Schema , model } from "mongoose"
import mongoose from "mongoose";
export interface IUser {
    username: string;
    email: string;
    password: string;
    isVarified?: boolean;
    forgetPasswordToken?: string;
    forgetPasswordTokenExpiry?: Date;
    varifyToken: string;
    varifyTokenExpiry?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
const userSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true , lowercase: true, trim: true},
    password: { type: String, required: true, trim: true , },
    isVarified: { type: Boolean, default: false },
    forgetPasswordToken: { type: String  },
    forgetPasswordTokenExpiry: { type: Date  },
    varifyToken: { type: String  },
    varifyTokenExpiry: { type: Date  },

}, { timestamps: true });

const User = mongoose.models.User || model<IUser>("User", userSchema);
export default User;