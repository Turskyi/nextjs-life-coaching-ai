import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";
import { APP_NAME } from '../../../../constants';

export const metadata: Metadata = {
  title: `${APP_NAME} - Sign Up`,
};

export default function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp appearance={{ variables: { colorPrimary: "#0F172A" } }} />
    </div>
  );
}