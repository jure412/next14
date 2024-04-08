import React, { PropsWithChildren } from "react";
import { LinkExtendedProps } from "../NextLink/index.types";
import { LinkVariant } from "./index.types";

const Link: React.FC<PropsWithChildren<LinkExtendedProps>> = ({
  variant = LinkVariant.PRIMARY,
  children,
  className,
  disabled,
  handleClick,
}) => {
  let classNameVariant = "";
  switch (variant) {
    case LinkVariant.SECONDARY:
      classNameVariant = `text-warning-dark ${
        !disabled ? "hover:text-warning-inactive active:text-warning-light" : ""
      }`;
      break;
    default:
      classNameVariant = `text-primary-dark ${
        !disabled ? "hover:text-primary-inactive active:text-primary-light" : ""
      }`;

      break;
  }

  return (
    <div
      onClick={handleClick}
      className={`
          ${classNameVariant} 
          ${className} 
          transition-transform duration-100
          hover:-translate-x-12 active:-translate-x-1
          cursor-pointer	
        `}
    >
      {children}
    </div>
  );
};

export default Link;
