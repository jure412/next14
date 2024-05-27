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
    return <h1 className={`text-5xl ${className ?? ""}`}>{children}</h1>;
  } else if (h2) {
    return <h2 className={`text-4xl ${className ?? ""}`}>{children}</h2>;
  } else if (h3) {
    return <h3 className={`text-3xl ${className ?? ""}`}>{children}</h3>;
  } else if (p) {
    return <p className={`text-base ${className ?? ""}`}>{children}</p>;
  } else {
    return <span className={`${className ?? ""}`}>{children}</span>;
  }
};

export default Typography;
