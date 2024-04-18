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
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  useEffect(() => {
    if (error) {
      const errorMessage = error?.message as string;
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <div className="mb-4 w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-neutral-dark mb-4"
      >
        {label}
      </label>
      <input
        {...register(name, validation)}
        type={type}
        placeholder={placeholder}
        className={`ease-in-out duration-300 mt-1 px-6 py-4 block w-full rounded-md border-neutral-light shadow-primary focus:shadow-none focus:border-primary-dark focus:ring focus:ring-primary-light focus:ring-opacity-80 `}
      />
    </div>
  );
};

export default Input;
