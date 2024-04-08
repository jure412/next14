import React from "react";
import { TypographyProps } from "./index.types";

const Typography: React.FC<TypographyProps> = ({
  h1,
  p,
  h2,
  h3,
  children,
  className,
}) => {
  if (h1) {
    return <h1 className={`${className} text-5xl`}>{children}</h1>;
  } else if (h2) {
    return <h2 className={`${className} text-4xl`}>{children}</h2>;
  } else if (h3) {
    return <h3 className={`${className} text-3xl`}>{children}</h3>;
  } else if (p) {
    return <p className={`${className} text-base`}>{children}</p>;
  } else {
    return <span className={`${className} `}>{children}</span>;
  }
};

export default Typography;
