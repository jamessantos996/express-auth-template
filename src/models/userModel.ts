import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    matchPassword: (inputPassword: string) => boolean;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (inputPassword: string) {
    return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
