import React from "react";

type Props = {
  children: React.ReactNode;
};

function AuthLayout({ children }: Props) {
  return <div className="mx-auto w-full mt-10 max-w-md p-6">{children}</div>;
}

export default AuthLayout;
