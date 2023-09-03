const axios = require("axios");
import { NextRequest, NextResponse } from "next/server";
// API endpoint for CAPTCHA verification
export const  POST = async (req :NextRequest ) => {
  try {

    const { value } = await req.json();
    console.log(value, "captcha value")
    const secretKey = "6LedaPUnAAAAADWHRv_ErMdERTOPRRoZS5PILPdm"; // Replace with your reCAPTCHA secret key

    const verificationResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: secretKey,
          response: value,
        },
      }
    );

    if (verificationResponse.data.success) {
      // CAPTCHA verified successfully
     return NextResponse.json({message: 'successfully pass captcha'} , {status:200})
    } else {
      // CAPTCHA verification failed
      return NextResponse.json({message: 'captcha has failed'} , {status:400})
    }
  } catch (error) {
    console.error("Captcha verification error:", error);
    return NextResponse.json({message: 'verificatio error'} , {status:500})
}
};
