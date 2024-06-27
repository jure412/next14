import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMe } from "../../../../actions/auth";
import CanvasBoard from "../../../../components/CanvasBoard";
import { getDrawingById } from "../../../../helpers/queries/index.client";

const Page = async ({ params }: { params: { id: string } }) => {
  const getMeData = await getMe();
  const getDrawingByIdData = await getDrawingById(
    params.id,
    process.env.APP_URL + "/api/drawings/",
    {
      headers: headers(),
    }
  );

  if (!getDrawingByIdData.success) {
    redirect("/");
  }
  return (
    <CanvasBoard
      getMeData={getMeData}
      getDrawingByIdData={getDrawingByIdData}
      id={params.id}
    />
  );
};

export default Page;
