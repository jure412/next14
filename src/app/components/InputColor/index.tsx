import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { InputColorsProps } from "./index.types";

const InputColors: React.FC<InputColorsProps> = ({
  label,
  name,
  colorOptions,
  validation,
}) => {
  const { register, formState, setValue, watch } = useFormContext();
  const { errors } = formState;
  const error = errors[name];

  useEffect(() => {
    if (error) {
      const errorMessage = error?.message as string;
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-dark mb-2"
        >
          {label}
        </label>
      )}
      <input
        type="text"
        {...register(name, validation)}
        className="sr-only peer mt-2"
      />
      <div className="flex gap-4">
        {colorOptions.map((color: string) => (
          <div
            key={color}
            onClick={() => setValue("color", color)}
            style={{ backgroundColor: color }}
            className={`rounded-lg h-4 w-4 cursor-pointer hover:opacity-70
            ${watch("color") === color ? "scale-125" : ""}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default InputColors;
