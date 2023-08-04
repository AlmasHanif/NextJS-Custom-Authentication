import React from "react";
import Link from "next/link";
function ProfilePage() {
  return (
    <div className="all-pages">
      <h2>Welcome to Profile Page</h2>
      <div className="all-links">
        <Link href={"/"}>home</Link>
        <Link href={"/login"}>Login</Link>
        <Link href={"/signup"}>Signup</Link>
      </div>
    </div>
  );
}

export default ProfilePage;
