import { LinkProps } from "next/link";

export enum LinkVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

export type LinkCustomProps = LinkProps & {
  variant?: LinkVariant;
  disabled?: boolean;
  className?: string;
};
