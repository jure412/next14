import React from "react";
import { ContainerProps } from "./index.types";

const Container: React.FC<ContainerProps> = ({ className, children }) => {
  return (
    <div className={`2xl:container 2xl:mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
