import Button from "./components/Button";
import { ButtonVariant } from "./components/Button/index.types";
import Link from "./components/NextLink";
import { LinkVariant } from "./components/NextLink/index.types";
import Typography from "./components/Typography";

export default function Home() {
  return (
    <div>
      <div className="container mx-auto px-6 py-8">
        <Typography h1>Heading 1</Typography>
        <Typography h2>heading 2</Typography>
        <Typography h3>heading 3</Typography>
        <Typography p>Paragraph</Typography>
        <Typography>span</Typography>
        <Typography className="text-sm">span</Typography>
      </div>
      <div className="container mx-auto px-6 flex gap-4 flex-wrap">
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
      <div className="container mx-auto px-6 flex py-8">
        <Link legacyBehavior href="/">
          Link
        </Link>
        <Link variant={LinkVariant.SECONDARY} legacyBehavior href="/">
          Link
        </Link>
      </div>
    </div>
  );
}
