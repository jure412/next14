import { headers } from "next/headers";
import { getMe } from "../../../../actions/auth";
import CanvasBoard from "../../../../components/CanvasBoard";
import { getDrawingById } from "../../../../helpers/queries/index.client";

const Page = async ({ params }: { params: { id: string } }) => {
  const getMeData = getMe();
  const getDrawingByIdData = getDrawingById(
    params.id,
    process.env.APP_URL + "/api/drawings/",
    {
      headers: headers(),
    }
  );

  return (
    <CanvasBoard
      getMeData={getMeData}
      getDrawingByIdData={getDrawingByIdData}
      id={params.id}
    />
  );
};

export default Page;
