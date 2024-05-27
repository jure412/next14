import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { MdDraw } from "react-icons/md";
import { LinkVariant } from "../../../../components/Link/index.types";
import Modal from "../../../../components/Modal";
import { getDrawings } from "../../../../helpers/queries/index.client";
import DrawingsList from "../../../../modules/DrawingsList";
import NewDrawing from "../../../../modules/ModalContent/NewDrawing";
import { getQueryClient } from "../../../../providers/PrefetchData.provider";

const Page = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getDrawings"],
    queryFn: () =>
      getDrawings(process.env.NEXTAUTH_URL + "/api/drawings", {
        headers: headers(),
      }),
  });
  return (
    <div>
      <div className="flex gap-4 flex-col">
        <div className="my-8 self-end">
          <Modal
            id="createNewDrawing"
            linkType={LinkVariant.SECONDARY}
            linkChildren={<MdDraw size={20} />}
          >
            <NewDrawing />
          </Modal>
        </div>
        <div className="grid 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <DrawingsList />
          </HydrationBoundary>
        </div>
      </div>
    </div>
  );
};

export default Page;
