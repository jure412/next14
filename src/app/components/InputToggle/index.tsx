import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { InputToggleProps, Size } from "./index.types";

const InputToggle: React.FC<InputToggleProps> = ({
  size,
  label,
  name,
  validation,
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

  const SizeClassName =
    size === Size.SMALL
      ? "h-4 w-7 after:h-4 after:w-4"
      : "h-6 w-11 after:h-6 after:w-6";

  return (
    <label>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-dark mb-2"
        >
          {label}
        </label>
      )}
      <input
        type="checkbox"
        {...register(name, validation)}
        className="sr-only peer"
      />
      <div
        className={`
            peer-checked:after:translate-x-full
            peer-checked:after:border-white
            outline-none 
            rounded-full 
            cursor-pointer 
            relative 
            bg-neutral-light 
            after:content-['']
            after:absolute
            after:bg-accent-light
            after:border
            after:rounded-full
            after:transition-all
            after:border-neutral-dark 
            ${SizeClassName}
          `}
      ></div>
    </label>
  );
};

export default InputToggle;
