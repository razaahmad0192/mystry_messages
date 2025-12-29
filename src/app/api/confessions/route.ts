import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import mongoose from "mongoose";
import Confession from "@/src/model/Confession";
import { User } from "next-auth";
import { confessionSchema } from "@/src/schemas/confessionSchema";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        const _user: User = session?.user as User;

        if (!_user || !session) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized. Please sign in to post a confession.",
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content } = body;

        // Validate with Zod
        const validationResult = confessionSchema.safeParse({ content });
        if (!validationResult.success) {
            const errorMessage = validationResult.error.issues[0]?.message || "Invalid confession content";
            return Response.json(
                {
                    success: false,
                    message: errorMessage,
                },
                { status: 400 }
            );
        }

        const validatedContent = validationResult.data.content;

        // Validate userId
        if (!_user._id || !mongoose.Types.ObjectId.isValid(_user._id)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid user ID",
                },
                { status: 400 }
            );
        }

        const userId = new mongoose.Types.ObjectId(_user._id);
        const userName = _user.username?.trim() || "Anonymous";
        
        const confession = await Confession.create({
            content: validatedContent,
            userId,
            userName,
        });

        return Response.json(
            {
                success: true,
                message: "Confession created successfully",
                confession: {
                    _id: confession._id,
                    content: confession.content,
                    createdAt: confession.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create confession", error);
        
        // Handle specific MongoDB errors
        if (error instanceof mongoose.Error.ValidationError) {
            return Response.json(
                {
                    success: false,
                    message: "Validation error: " + Object.values(error.errors).map(e => e.message).join(", "),
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: false,
                message: "Failed to create confession. Please try again later.",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const skip = (page - 1) * limit;

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.",
                },
                { status: 400 }
            );
        }

        // Fetch confessions with pagination
        const [confessions, totalCount] = await Promise.all([
            Confession.find({})
                .sort({ createdAt: -1 })
                .select("content createdAt _id")
                .skip(skip)
                .limit(limit)
                .lean(),
            Confession.countDocuments({}),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return Response.json(
            {
                success: true,
                confessions,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to fetch confessions", error);

        return Response.json(
            {
                success: false,
                message: "Failed to fetch confessions. Please try again later.",
            },
            { status: 500 }
        );
    }
}
