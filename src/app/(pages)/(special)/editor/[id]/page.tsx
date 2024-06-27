import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMe } from "../../../../actions/auth";
import CanvasBoard from "../../../../components/CanvasBoard";
import Container from "../../../../components/Container";
import { LinkVariant } from "../../../../components/Link/index.types";
import NextLink from "../../../../components/NextLink";
import Typography from "../../../../components/Typography";
import { isMobileDevice } from "../../../../helpers/functions/server";
import { getDrawingById } from "../../../../helpers/queries/index.client";

const Page = async ({ params }: { params: { id: string } }) => {
  if (await isMobileDevice()) {
    return (
      <Container className="my-4">
        <Typography h1>Mobile devices are not supported</Typography>
        <NextLink
          className="my-8"
          prefetch={false}
          variant={LinkVariant.SECONDARY}
          href="/"
          scroll={false}
        >
          Go home
        </NextLink>
      </Container>
    );
  }
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
