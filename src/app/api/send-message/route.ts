import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    await dbConnect();
    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne({username});

        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        //is user accepting messages
        if(!user.isAcceptingMessage){
            return NextResponse.json(
                {
                    success: false,
                    message: "User is not accepting any messages"
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = {content, createdAt: new Date()}

        user.messages.push(newMessage as Message)
        await user.save()

        return NextResponse.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("An unexpected error occured", error);
        return NextResponse.json(
            {
                success: false,
                message: "An unexpected error occured"
            },
            {
                status: 500
            }
        )
    }
}