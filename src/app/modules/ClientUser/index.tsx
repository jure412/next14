"use client";

import { getMe } from "@/app/helpers/queries";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

export default function ClientUser() {
  const { data, isLoading } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });
  return (
    <>
      {isLoading ? (
        <FaSpinner size={20} className="spinner-icon animate-spin" />
      ) : data?.isAuth ? (
        <div>
          <h1>Welcoda {data?.data?.user?.username}</h1>
          <h2>Your email is {data?.data?.user?.email}</h2>
        </div>
      ) : (
        <h1>Welcome to the app</h1>
      )}
    </>
  );
}
