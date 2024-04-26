import CanvasBoard from "@/app/components/CanvasBoard";
import { getDrawingById } from "@/app/helpers/queries/index.client";
import { getQueryClient } from "@/app/providers/PrefetchData.provider";
import { headers } from "next/headers";

const Page = async ({ params }: { params: { id: string } }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getDrawingById", params.id],
    queryFn: () =>
      getDrawingById(
        params.id,
        process.env.NEXTAUTH_URL_INTERNAL + "/api/drawings/",
        { headers: headers() }
      ),
  });

  return <CanvasBoard id={params.id} />;
};

export default Page;
