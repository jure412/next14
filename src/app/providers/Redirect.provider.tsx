"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { getMe } from "../helpers/queries/index.client";

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isError, isLoading, isFetched } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => getMe(),
  });
  const protectedRoutes = "/drawings";
  if (isFetched && !data?.isAuth && pathname.includes(protectedRoutes)) {
    router.push("/");
  }
  return <>{children}</>;
};
