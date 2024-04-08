import { ReactNode } from "react";

export type TypographyProps = {
  h1?: boolean;
  p?: boolean;
  h2?: boolean;
  h3?: boolean;
  children: ReactNode;
  className?: string;
};
