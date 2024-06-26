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
          will-change-transform
          transition-transform duration-100
          hover:-translate-y-1 active:-translate-y-0
          cursor-pointer	
        `}
    >
      {children}
    </div>
  );
};

export default Link;
