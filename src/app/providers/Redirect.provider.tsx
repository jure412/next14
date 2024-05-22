"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { getMe } from "../helpers/queries/index.client";

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isFetched } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => getMe(),
  });

  if (
    isFetched &&
    !data?.isAuth &&
    (pathname.startsWith("/drawings") || pathname.startsWith("/editor"))
  ) {
    router.push("/");
  }
  return <>{children}</>;
};
