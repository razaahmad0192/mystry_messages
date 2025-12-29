import { z } from "zod";

export const confessionSchema = z.object({
    content: z.string()
        .min(10, { message: "Confession must be at least 10 characters long" })
        .max(500, { message: "Confession cannot exceed 500 characters" })
        .trim()
});

