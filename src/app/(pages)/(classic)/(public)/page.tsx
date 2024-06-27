import imageTree from "../../../../../public/images/tree.jpg";
import { getMe } from "../../../actions/auth";
import Button from "../../../components/Button";
import { ButtonVariant } from "../../../components/Button/index.types";
import CustomImage from "../../../components/CustomImage";
import { LinkVariant } from "../../../components/Link/index.types";
import NextLink from "../../../components/NextLink";
import Typography from "../../../components/Typography";
import { getBase64 } from "../../../helpers/functions/server";
import ClientUser from "../../../modules/ClientUser";

export default async function Home() {
  const getMeData = await getMe();
  const imageTreePlaceholder = await getBase64(
    process.env.APP_URL + "/images/tree.jpg"
  );

  return (
    <>
      <ClientUser getMeData={getMeData} id={"clientUser"} />
      <div id={"typographySection"} className="my-8 w-auto">
        <Typography h1>Heading 1</Typography>
        <Typography h2>heading 2</Typography>
        <Typography h3>heading 3</Typography>
        <Typography p>Paragraph</Typography>
      </div>
      <CustomImage
        placeholder="blur"
        id={"customImage"}
        className="my-8"
        src={imageTree}
        blurDataURL={imageTreePlaceholder}
        alt="placeholder"
        width={1512}
        height={1008}
      />
      <div id={"buttonSection"} className="my-8 flex gap-4 flex-wrap">
        <Button loading={false} variant={ButtonVariant.PRIMARY}>
          Primary
        </Button>
        <Button loading={true} variant={ButtonVariant.PRIMARY}>
          Loading
        </Button>
        <Button loading={false} variant={ButtonVariant.SECONDARY}>
          Secondary
        </Button>
        <Button loading={true} variant={ButtonVariant.SECONDARY}>
          Loading
        </Button>
        <Button loading={false} variant={ButtonVariant.TERTIARY}>
          TERTIARY
        </Button>
        <Button loading={true} variant={ButtonVariant.TERTIARY}>
          Loading
        </Button>
        <Button loading={false} variant={ButtonVariant.DANGER}>
          DANGER
        </Button>
        <Button loading={true} variant={ButtonVariant.DANGER}>
          Loading
        </Button>
        <Button loading={false} variant={ButtonVariant.WARNING}>
          WARNING
        </Button>
        <Button loading={true} variant={ButtonVariant.WARNING}>
          Loading
        </Button>
        <Button loading={false} variant={ButtonVariant.SUCCESS}>
          SUCCESS
        </Button>
        <Button loading={true} variant={ButtonVariant.SUCCESS}>
          Loading
        </Button>
      </div>
      <div id={"linkSection"} className="flex my-8 gap-4">
        <NextLink prefetch href="/">
          NextLink
        </NextLink>
        <NextLink prefetch variant={LinkVariant.SECONDARY} href="/">
          NextLink
        </NextLink>
      </div>
    </>
  );
}
