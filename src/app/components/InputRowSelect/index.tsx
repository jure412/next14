import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import Link from "../Link";
import { LinkVariant } from "../Link/index.types";
import { InputRowSelectProps } from "./index.types";

const InputRowSelect: React.FC<InputRowSelectProps> = ({
  label,
  name,
  select,
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
      <input type="text" {...register(name)} className="sr-only peer" />
      <div className="flex gap-2">
        {select.map((option) => (
          <Link
            key={option.value}
            variant={
              watch(name) === option.value
                ? LinkVariant.SECONDARY
                : LinkVariant.PRIMARY
            }
            handleClick={() => setValue(name, option.value)}
          >
            {option.content}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InputRowSelect;
