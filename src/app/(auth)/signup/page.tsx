
import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account | FixMate",
  description:
    "Create a FixMate account to book device and home appliance repair services.",
};

const SignupPage = () => {
  return <SignupForm />;
};

export default SignupPage;
