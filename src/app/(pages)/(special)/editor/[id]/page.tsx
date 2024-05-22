import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import CanvasBoard from "../../../../components/CanvasBoard";
import { getDrawingById } from "../../../../helpers/queries/index.client";
import { getQueryClient } from "../../../../providers/PrefetchData.provider";

const Page = async ({ params }: { params: { id: string } }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getDrawingById", params.id],
    queryFn: () =>
      getDrawingById(params.id, process.env.NEXTAUTH_URL + "/api/drawings/", {
        headers: headers(),
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CanvasBoard id={params.id} />
    </HydrationBoundary>
  );
};

export default Page;
