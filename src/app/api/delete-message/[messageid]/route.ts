import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import mongoose from "mongoose";
import UserModel from "@/src/model/User";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ messageid: string }> }) {
    // In Next.js 15+, params is a Promise and must be awaited
    const { messageid } = await params;
    console.log("Message ID from params:", messageid);
    
    if (!messageid) {
        return NextResponse.json({
            success: false,
            message: "Message ID is required"
        }, { status: 400 });
    }
    
    const messageId = new mongoose.Types.ObjectId(messageid);
    console.log("Parsed Message ID:", messageId);
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;
    console.log("MADR CHOD USER :", _user);
    if (!_user || !session) {
         return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    try {
        const updateResult = await UserModel.updateOne(
            { _id: new mongoose.Types.ObjectId(_user._id) },
            { $pull: { messages: { _id: messageId } } }
        )
        if(updateResult.modifiedCount == 0){
         return NextResponse.json(
            {
                success: false,
                message: "Message not found or already deleted"
            },
            {status:404}
         )   
        }
         return NextResponse.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            {status:200}
         )   
    } catch (error) {
        console.log("Error deleting message:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error deleting meessage"
            },
            {status:500}
         )   
    }
}