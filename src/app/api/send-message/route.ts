import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    await dbConnect()

    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return NextResponse.json({
            success: false,
            message: "User not found"
        }, {
            status: 401
        })
        }
         if(!user.isAcceptingMessage){
            return NextResponse.json({
            success: false,
            message: "User is not accepting the messages"
        }, {
            status: 403
        })
        }

        const newMessage = {content, createdAt: new Date()}
        console.log(newMessage);
        user.message.push(newMessage as Message)
        await user.save()
        return NextResponse.json({  // ✅ Return success response
            success: true,
            message: "Message sent successfully"
        }, { status: 200 });
    } catch (error) {
        console.log("Error adding messages",error)
          return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}