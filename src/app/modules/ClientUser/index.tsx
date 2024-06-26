"use client";

import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { getMe } from "../../actions/auth";
import Typography from "../../components/Typography";

export default function ClientUser({
  id,
  getMeData,
}: {
  id?: string;
  getMeData: any;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["getMe"],
    initialData: getMeData,
    queryFn: () => getMe(),
    staleTime: Infinity,
  });

  return (
    <div
      id={id ?? ""}
      className="w-fit bg-white rounded-lg shadow-primary overflow-hidden my-3"
    >
      {isLoading ? (
        <FaSpinner size={20} className="spinner-icon animate-spin" />
      ) : data?.isAuth ? (
        <div className="p-8">
          <Typography h3>Welcome {data?.data?.user?.username}</Typography>
          <Typography p>{data?.data?.user?.email}</Typography>
        </div>
      ) : (
        <Typography className="p-8" h3>
          Welcome to the app
        </Typography>
      )}
    </div>
  );
}
