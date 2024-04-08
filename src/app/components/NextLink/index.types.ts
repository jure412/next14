import { LinkProps } from "next/link";

export enum LinkVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

export type LinkCustomProps = LinkProps & LinkExtendedProps;

export type LinkExtendedProps = {
  variant?: LinkVariant;
  disabled?: boolean;
  className?: string;
  handleClick?: () => void;
};
