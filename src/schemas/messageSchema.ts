import {z} from "zod";

export const messageSchema = z.object({
    content: z.string()
        .min(5, {message: "Message cannot be shorter than 5 characters"})
        .max(300, {message: "Message content cannot exceed 300 characters"})
});