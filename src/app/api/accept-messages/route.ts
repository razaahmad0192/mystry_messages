import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    const user: User = session.user as User;

    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update User Status to accept messages",

                }, { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated succesfully",
                updatedUser

            }, { status: 200 }
        )

    } catch (error) {
        console.error("Failed to update User Status to accept messages", error)
        return Response.json(
            {
                success: false,
                message: "Failed to update User Status to accept messages",

            }, { status: 500 }
        )
    }
}

export async function GET(_request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    const user: User = session.user as User;

    const userId = user._id;

    try {

        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "User found",
            isAcceptingMessage: foundUser.isAcceptingMessages
        }, { status: 200 })

    } catch (error) {

        console.error("Error fetching user:", error);
        return Response.json({
            success: false,
            message: "Error fetching user"
        }, { status: 500 })

    }

}