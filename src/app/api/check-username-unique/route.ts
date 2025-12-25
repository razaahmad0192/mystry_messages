import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import {z} from "zod";
import {usernameValidation} from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
  

    await dbConnect();

    try{
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username") || ""
        }
        // Validate with Zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid username",
            }, { status: 400 });
        }
        const {username} = result.data;

       const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
       if(existingVerifiedUser){
              return Response.json({
                   success: false,
                   message: "Username is already taken by a user."
              }, { status: 409 });
       }
       return Response.json({
           success: true,
           message: "Username is available."
       }, { status: 200 });

    }catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json({
            success: false,
            message: "Error checking username uniqueness"
        }, { status: 500 });
    }
}