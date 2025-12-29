import mongoose, { Schema, Document } from "mongoose";

export interface Confession extends Document {
    content: string;
    userId: mongoose.Types.ObjectId;
    userName: string;
    createdAt: Date;
    updatedAt: Date;
}

const ConfessionSchema: Schema<Confession> = new Schema(
    {
        content: {
            type: String,
            required: [true, "Confession content is required"],
            trim: true,
            minlength: [10, "Confession must be at least 10 characters long"],
            maxlength: [500, "Confession cannot exceed 500 characters"],
            validate: {
                validator: function (v: string) {
                    return v.trim().length >= 10 && v.trim().length <= 500;
                },
                message: "Confession must be between 10 and 500 characters",
            },
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        userName: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            maxlength: [50, "Username cannot exceed 50 characters"],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Compound index for efficient queries
ConfessionSchema.index({ userId: 1, createdAt: -1 });
ConfessionSchema.index({ createdAt: -1 }); // For sorting by date

// Ensure model is not recompiled during hot reloads
export default mongoose.models.Confession ||
    mongoose.model<Confession>("Confession", ConfessionSchema);
