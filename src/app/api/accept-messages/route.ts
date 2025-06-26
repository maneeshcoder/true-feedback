import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/otpion";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import { NextResponse } from "next/server";
// import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User  //check why it is written like this

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true })
        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "ailed to update user status to accept messages"
            }, {
                status: 401
            })
        }

        return NextResponse.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        }, {
            status: 200
        })


    } catch (error) {
        console.log("failed to update user status to accept messages")
        return NextResponse.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, {
            status: 500
        })
    }
}

export async function GET(request: Request){
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

    const userId = user._id;
   try {
     const founduser = await UserModel.findById(userId)
     if (!founduser) {
        return NextResponse.json({
            success: false,
            message: "User not found"
        }, {
            status: 404
        })
    }
     return NextResponse.json({
            success: true,
            isAcceptingMessage: founduser.isAcceptingMessage,
        }, {
            status: 200
        })
   } catch (error) {
     console.log("failed to update user status to accept messages")
     return NextResponse.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, {
            status: 500
        })
   }

}