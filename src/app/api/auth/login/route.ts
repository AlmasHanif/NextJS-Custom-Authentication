import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { findUnique } from "@/helpers";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Limiter } from "@/config/limiter";

export const POST = async (req: NextRequest) => {
  try {
    let { email, password } = await req.json();

    const user = findUnique({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }
    const isValidPassword = await bcryptjs.compare(password, user.password);
    let resetTimer;
    if (!isValidPassword) {
      const remainingRequests = await Limiter.removeTokens(1);
        console.log(Limiter.tokenBucket.content , "remaining token")
      if (remainingRequests < 0) {
        return NextResponse.json(
          { message: '429 Too Many Requests - your IP is being rate limited' },
          { status: 429 }
        )
      }
      else {
        console.log("Remaining requests", remainingRequests);
      }
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    const token = await jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    // Create a new object without the password property
    let { password: hashedPassword, ...updatedUser } = user;

    const response = NextResponse.json(
      { message: "Successfully Logged in", user: updatedUser },
      { status: 200 }
    );
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 10);

    cookies().set("token", token, {
      httpOnly: true,
      expires: expirationDate,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 200 }
    );
  }
};
