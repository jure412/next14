"use client";

import { useSession } from "@/app/providers/Session.provider";
import { useQuery } from "react-query";
import { protectedQuery } from "../../../../actions/protected";

export default function ClientUser() {
  const { user } = useSession();
  const { data, isLoading, isError } = useQuery("myData", () =>
    protectedQuery()
  );

  console.log(data, isLoading, isError);

  if (isLoading)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  else
    return (
      <div>
        <h1>Client User</h1>
        {JSON.stringify(user)}
      </div>
    );
}
