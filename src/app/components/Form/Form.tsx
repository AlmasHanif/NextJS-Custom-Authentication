"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

interface formProps {
  btnTitle: string;
  isLogin?: boolean;
  apiUrl: string;
}

function Form(props: formProps) {
  const { btnTitle, isLogin = false, apiUrl } = props;
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [btnText, setBtnText] = useState(btnTitle);
  const [limiterError, setLimiterError] = useState("")
  const router = useRouter();

  const handleFormValueChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setFormValues({ ...formValues, [evt.target.name]: evt.target.value });
  const handleFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setBtnText("Loading...");
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const result = await response.json();
      console.log(result, "result");
      setLimiterError(result.message)
      toast.error(result.error || result.message)
      if (result?.message) {
        setBtnText("Success");
        const redirectPath = isLogin ? "/" : "/login";
        router.push(redirectPath);
      }
    } catch (err: any) {
      toast.error(err.message)
      setBtnText("Something went wrong");
      console.log(err);
    } finally {
    }
  };

  const handleCaptchaChange = async (value: any) => {
    try {
      const response = await fetch("/api/auth/captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });

      const data = await response.json();

      if (data.message === "successfully pass captcha") {
        console.log(data.message, "data")
        alert("now try login again ")
        // CAPTCHA verified successfully, proceed with form submission
      } else {
        // CAPTCHA verification failed, display an error message
        alert("wrong captcha try after 5 minutes")
      }
    } catch (error) {
      console.error("Captcha verification error:", error);
    }

  };
  return (
    <div className="main-form">
      <form onSubmit={handleFormSubmit}>
        {!isLogin && (
          <label htmlFor="username">
            Username
            <input
              onChange={handleFormValueChange}
              type="text"
              name="username"
              placeholder={"Enter Your Username"}
              value={formValues.username}
            />
          </label>
        )}
        <label htmlFor="email">
          Email
          <input
            onChange={handleFormValueChange}
            type="email"
            name="email"
            placeholder={"Enter Your Email"}
            value={formValues.email}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            onChange={handleFormValueChange}
            type="password"
            name="password"
            placeholder={"Enter Your Password"}
            value={formValues.password}
          />
        </label>
        {isLogin && limiterError ===
          "429 Too Many Requests - your IP is being rate limited" ?
          <ReCAPTCHA
            sitekey="6LedaPUnAAAAAKMOjzjkJTOBpD-4Fp0QcRa5hEtB"
            onChange={handleCaptchaChange}
          />
          : null}



        <button type="submit">{btnText}</button>
      </form>

    </div>
  );
}

export default Form;
