import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { InputProps } from "./index.types";

const Input: React.FC<InputProps> = ({
  name,
  label,
  type = "text",
  validation,
  placeholder,
  ...rest
}) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;
  const error = errors[name];

  useEffect(() => {
    if (error) {
      const errorMessage = error?.message as string;
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-dark mb-2"
        >
          {label}
        </label>
      )}
      <input
        {...register(name, validation)}
        type={type}
        placeholder={placeholder}
        {...rest}
        className={`ease-in-out duration-300 block w-full 
        ${
          type === "range"
            ? `
              w-full h-[20px] border border-primary-dark accent-accent-dark px-1 rounded-lg appearance-none cursor-pointer range-sm 
            `
            : `
            mt-1 
            py-4 
            px-6 rounded-md border-neutral-light shadow-primary
            focus:shadow-none focus:border-primary-dark
            focus:ring focus:ring-primary-light
            focus:ring-opacity-80
            `
        }`}
      />
    </div>
  );
};

export default Input;
