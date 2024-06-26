"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { MdDraw } from "react-icons/md";
import { toast } from "react-toastify";
import { newDrawing } from "../../actions/drawing";
import Button from "../../components/Button";
import { ButtonVariant } from "../../components/Button/index.types";
import Input from "../../components/Input";
import Typography from "../../components/Typography";
import { getUserById } from "../../helpers/queries/index.client";
import { AuthenticationProps, NewDrawingsValuesProps } from "./index.types";

const defaultValues: NewDrawingsValuesProps = {
  name: "",
  email: "",
  users: [],
};

const NewDrawing: React.FC<AuthenticationProps> = ({
  setIsOpen,
  setHeader,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const methods = useForm<NewDrawingsValuesProps>({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (values: NewDrawingsValuesProps) => {
    mutate({
      name: values.name,
      users: values.users,
    });
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: newDrawing,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      if (!data?.success) {
        toast.error(data?.msg?.[0]);
      } else {
        toast.success(data?.msg?.[0]);

        queryClient.invalidateQueries({ queryKey: ["getDrawings"] });
        setIsOpen(false);
      }
    },
  });

  const handleAddUser = async () => {
    const users: string[] = methods.getValues("users");
    const email: string = methods.getValues("email") as string;
    if (email.trim() === "") {
      toast.error("Email is required");
      return;
    }
    if (email && users.includes(email)) {
      toast.error("User already added");
      return;
    }
    setLoading(true);
    const user = await getUserById(email);
    if (!user.success) {
      toast.error(user.msg[0]);
    } else {
      toast.success(user.msg[0]);
      methods.setValue("users", [...users, email]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setHeader?.(
      <>
        <MdDraw className="text-primary-dark" size={40} />
        <Typography h2>New</Typography>
      </>
    );
  }, [setHeader]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col mt-8 gap-4"
      >
        <Input
          label="Name *"
          name="name"
          placeholder="name"
          validation={{
            maxLength: { value: 16, message: "Max length is 16" },
            required: "Name is required",
          }}
        />
        <div className="flex gap-4 w-full">
          <Input
            label="Add user"
            name="email"
            placeholder="email"
            validation={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            }}
          />
          <Button
            variant={ButtonVariant.TERTIARY}
            loading={isPending || loading}
            className="mt-7"
            type="button"
            onClick={handleAddUser}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          {methods.watch("users").map((email: string, i: number) => {
            return (
              <Button
                onClick={() => {
                  const users = methods.getValues("users");

                  users.splice(i, 1);
                  methods.setValue("users", users);
                }}
                key={i}
                variant={ButtonVariant.SECONDARY}
                type="button"
              >
                <span className="mr-2">{email}</span> <AiOutlineClose />
              </Button>
            );
          })}
        </div>
        <Button loading={isPending || loading} className="mt-8" type="submit">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

export default NewDrawing;
