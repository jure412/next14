"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { getMe } from "../helpers/queries/index.client";

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => getMe(),
  });
  const protectedRoutes = ["/drawings"];
  if (!data?.isAuth && protectedRoutes.includes(pathname)) {
    router.push("/");
  }
  return <>{children}</>;
};
