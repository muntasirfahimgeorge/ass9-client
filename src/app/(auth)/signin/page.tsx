
import type { Metadata } from "next";
import SigninForm from "@/components/auth/SigninForm";

export const metadata: Metadata = {
  title: "Sign in | FixMate",
  description:
    "Sign in to your FixMate account to book repair services and manage appointments.",
};

const SigninPage = () => {
  return <SigninForm />;
};

export default SigninPage;
