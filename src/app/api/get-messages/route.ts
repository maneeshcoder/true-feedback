import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/otpion";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User  //check why it is written like this

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const result = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$message' },
            { $sort: { 'message.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$message' } } }
        ])

        if (!result || result.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No message to display"
            }, {
                status: 404
            })
        }
        console.log(result[0].messages);
        return NextResponse.json({
            success: true,
            message: result[0].messages
        }, {
            status: 200
        })
    } catch (error) {
        //todo
        console.log("Something went wrong",error)
          return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}