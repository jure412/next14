import React, { PropsWithChildren } from "react";
import { FaSpinner } from "react-icons/fa";
import { ButtonProps, ButtonSize, ButtonVariant } from "./index.types";

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  variant = ButtonVariant.PRIMARY,
  size = ButtonSize.MEDIUM,
  loading,
  children,
  className,
  disabled,
  ...rest
}) => {
  const disabledBtn = disabled || loading;

  const commonClassName = `will-change-transform flex items-center justify-center rounded focus:outline-none transition-all duration-200 shadow-primary ${
    !disabledBtn
      ? "hover:-translate-y-1 active:-translate-y-1 hover:shadow active:shadow-primary"
      : ""
  }`;
  let classNameSize = "";
  switch (size) {
    case ButtonSize.SMALL:
      classNameSize = "h-9 px-4 text-sm";
      break;
    case ButtonSize.LARGE:
      classNameSize = "h-11 px-5 text-lg";
      break;
    default:
      classNameSize = "h-13 px-6 text-base";
      break;
  }

  let classNameVariant = "";
  switch (variant) {
    case ButtonVariant.SECONDARY:
      classNameVariant = `bg-white text-secondary-dark ${
        !disabledBtn
          ? "hover:bg-secondary-light hover:text-white active:bg-secondary-dark "
          : ""
      }`;
      break;
    case ButtonVariant.TERTIARY:
      classNameVariant = `bg-neutral-dark active:bg-neutral-dark text-white ${
        !disabledBtn ? "hover:bg-neutral-light" : ""
      }`;
      break;
    case ButtonVariant.DANGER:
      classNameVariant = `bg-error-dark active:bg-error-dark text-white ${
        !disabledBtn ? "hover:bg-error-light" : ""
      }`;
      break;
    case ButtonVariant.WARNING:
      classNameVariant = `bg-warning-dark active:bg-warning-dark text-white ${
        !disabledBtn ? "hover:bg-warning-light" : ""
      }`;
      break;
    case ButtonVariant.SUCCESS:
      classNameVariant = `bg-success-dark active:bg-success-dark active:text-white text-white ${
        !disabledBtn ? "hover:bg-success-light hover:text-success-dark " : ""
      }`;
      break;
    default:
      classNameVariant = `bg-primary-dark active:bg-primary-dark text-white ${
        !disabledBtn ? "hover:bg-primary-light" : ""
      }`;

      break;
  }

  return (
    <button
      className={`
        ${classNameVariant} 
        ${classNameSize} 
        ${className} 
        ${commonClassName}
      `}
      disabled={disabledBtn}
      {...rest}
    >
      {loading ? <FaSpinner className="spinner-icon animate-spin" /> : children}
    </button>
  );
};

export default Button;
