"use client";
import Button from "@/app/components/Button";
import { ButtonVariant } from "@/app/components/Button/index.types";
import Input from "@/app/components/Input";
import Typography from "@/app/components/Typography";
import { getUserById } from "@/app/helpers/queries/index.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { MdDraw } from "react-icons/md";
import { toast } from "react-toastify";
import { newDrawing } from "../../../../actions/drawing";
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
  });

  const onSubmit = async (values: NewDrawingsValuesProps) => {
    setLoading(true);
    mutate({
      name: values.name,
      users: values.users,
    });
    setLoading(false);
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: newDrawing,
    onMutate: async (values: NewDrawingsValuesProps) => {
      await queryClient.cancelQueries({ queryKey: ["getDrawings"] });
      const prevDrawings: { data: any } = queryClient.getQueryData([
        "getDrawings",
      ]);
      const updatedDrawings = {
        ...prevDrawings,
        data: [...prevDrawings.data, { drawing: { name: values.name } }],
      };

      queryClient.setQueryData(["getDrawings"], updatedDrawings);
      return prevDrawings;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.msg?.[0]);
      } else {
        toast.success(data?.msg?.[0]);
        setIsOpen?.(false);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["getDrawings"] });
    },
  });

  const handleAddUser = async () => {
    const users: string[] = methods.getValues("users");
    const email: string = methods.getValues("email");
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
        className="flex flex-col mt-8"
      >
        <Input
          label="Name *"
          name="name"
          placeholder="name"
          validation={{
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
            loading={loading}
            className="mt-9"
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
        <Button className="mt-8" type="submit">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

export default NewDrawing;
