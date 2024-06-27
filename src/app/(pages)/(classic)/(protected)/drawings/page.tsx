import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MdDraw } from "react-icons/md";
import { LinkVariant } from "../../../../components/Link/index.types";
import Modal from "../../../../components/Modal";
import { getDrawings } from "../../../../helpers/queries/index.client";
import DrawingsList from "../../../../modules/DrawingsList";
import NewDrawing from "../../../../modules/ModalContent/NewDrawing";

const Page = async () => {
  const getDrawingsData = await getDrawings({
    url: `${process.env.APP_URL}/api/drawings`,
    options: {
      headers: headers(),
    },
    skip: 0,
    take: 24,
  });
  if (!getDrawingsData.success) {
    redirect("/");
  }
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
        <div className="grid 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4">
          <DrawingsList getDrawingsData={getDrawingsData} />
        </div>
      </div>
    </div>
  );
};

export default Page;
