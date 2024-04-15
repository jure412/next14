import Link from "next/link";
import React, { PropsWithChildren } from "react";
import LinkEl from "../Link";
import { LinkCustomProps, LinkVariant } from "./index.types";

const NextLink: React.FC<PropsWithChildren<LinkCustomProps>> = ({
  variant = LinkVariant.PRIMARY,
  children,
  className,
  disabled,
  ...rest
}) => {
  return (
    <Link {...rest}>
      <LinkEl disabled className={className} variant={variant}>
        {children}
      </LinkEl>
    </Link>
  );
};

export default NextLink;
