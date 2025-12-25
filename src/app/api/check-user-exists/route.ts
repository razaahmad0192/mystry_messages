import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
        const includeUnverified = searchParams.get("includeUnverified") === "true";

        if (!username) {
            return Response.json({
                success: false,
                message: "Username is required"
            }, { status: 400 });
        }

        // If includeUnverified is true, check for any user (verified or not)
        // Otherwise, only check for verified users
        const query = includeUnverified 
            ? { username }
            : { username, isVerified: true };

        const user = await UserModel.findOne(query);

        if (!user) {
            return Response.json({
                success: false,
                message: "User does not exist",
                exists: false
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "User exists",
            exists: true,
            isVerified: user.isVerified || false
        }, { status: 200 });

    } catch (error) {
        console.error("Error checking user existence:", error);
        return Response.json({
            success: false,
            message: "Error checking user existence"
        }, { status: 500 });
    }
}

