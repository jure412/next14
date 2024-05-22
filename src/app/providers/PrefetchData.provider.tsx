import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { getMe } from "../helpers/queries/index.client";

export const getQueryClient = () => new QueryClient();

export const PrefetchData = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = getQueryClient();

  queryClient.setDefaultOptions({
    queries: {
      staleTime: 1000 * 60,
      gcTime: 10 * 1000,
      refetchOnWindowFocus: false,
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["getMe"],
    queryFn: () =>
      getMe(process.env.NEXTAUTH_URL + "/api/user", {
        headers: headers(),
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};
