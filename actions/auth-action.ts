"use server";

import { z } from "zod";
import { signInSchema } from "@/lib/zod";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const loginAction = async(
    values: z.infer<typeof signInSchema>
) => {
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,            
            redirect: false
        });

        return { success: true };

    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }
        return { error: "Error 500" };
    }
};