import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { validateRequest } from "../../../utils/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await validateRequest();
  const pathname = headers().get("x-pathname");
  if (pathname === "/protected") {
    if (!sessionData.user) {
      redirect("/");
    }
  }
  return <div>{children}</div>;
}
