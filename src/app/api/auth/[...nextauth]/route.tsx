import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables");
}


const handler =  NextAuth(authOptions);
export const GET = handler;
export const POST = handler;