"use client";
import Button from "@/app/components/Button";
import { ButtonVariant } from "@/app/components/Button/index.types";
import Input from "@/app/components/Input";
import Link from "@/app/components/Link";
import Typography from "@/app/components/Typography";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  createGoogleAuthorizationURL,
  resendVerificationEmail,
  signIn,
  signUp,
} from "../../../../actions/auth";
import { AuthenticationProps, FormProps, Values } from "./index.types";

const singUpValues: Values = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
};

const singInValues: Values = {
  password: "12345678",
  email: "jur3curk+1@gmail.com",
};

const ResendValues: Values = {
  email: "",
};

const Authentication: React.FC<AuthenticationProps> = ({
  setIsOpen,
  setHeader,
}) => {
  const queryClient = useQueryClient();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useForm<Values>({
    defaultValues:
      step === 1 ? singInValues : step === 2 ? singUpValues : ResendValues,
  });

  const onSubmit = async (values: Values) => {
    setLoading(true);
    const response: any =
      step === 1
        ? await signIn(values)
        : step === 2
        ? await signUp(values)
        : await resendVerificationEmail(values.email);
    if (response.success) {
      toast.success(response?.msg?.[0]);
      setIsOpen?.(false);
      queryClient.invalidateQueries({ queryKey: ["getMe"] });
    } else {
      response.msg?.forEach((msg: string) => {
        toast.error(msg);
      });
    }
    setLoading(false);
  };

  const handleGoogleSubmit = async () => {
    setLoading(true);
    const res = await createGoogleAuthorizationURL();
    setLoading(false);
    if (!res?.success) {
      toast.error(res.msg[0]);
    } else if (res.success) {
      window.location.href = res?.data?.toString()!;
    }
  };

  useEffect(() => {
    if (step === 1) {
      setHeader?.(
        <>
          <AiOutlineLogin className="text-primary-dark" size={40} />
          <Typography h2>Login</Typography>
        </>
      );
    }
    if (step === 2) {
      setHeader?.(
        <>
          <AiOutlineLogin className="text-primary-dark" size={40} />
          <Typography h2>Sign Up</Typography>
        </>
      );
    }
    if (step === 3) {
      setHeader?.(
        <>
          <AiOutlineLogin className="text-primary-dark" size={40} />
          <Typography h2>Verification</Typography>
        </>
      );
    }
  }, [step, setHeader]);

  return (
    <>
      <Button
        variant={ButtonVariant.DANGER}
        className="w-full"
        onClick={handleGoogleSubmit}
        loading={loading}
      >
        Sign in with Google
      </Button>
      {step === 1 ? (
        <SignIn
          methods={methods}
          loading={loading}
          onSubmit={onSubmit}
          setStep={setStep}
        />
      ) : step === 2 ? (
        <SignUp
          methods={methods}
          loading={loading}
          onSubmit={onSubmit}
          setStep={setStep}
        />
      ) : (
        <ResendVerification
          loading={loading}
          methods={methods}
          onSubmit={onSubmit}
          setStep={setStep}
        />
      )}
    </>
  );
};

export default Authentication;

const ResendVerification: React.FC<FormProps> = ({
  methods,
  onSubmit,
  setStep,
  loading,
}) => {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col mt-8"
      >
        <Input
          label="Email"
          name="email"
          placeholder="Email"
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Invalid email address",
            },
          }}
        />
        <Button loading={loading} className="mt-8" type="submit">
          Submit
        </Button>
      </form>
      <Link className="mt-8" handleClick={() => setStep(2)}>
        Go back
      </Link>
    </FormProvider>
  );
};

const SignUp: React.FC<FormProps> = ({
  methods,
  onSubmit,
  setStep,
  loading,
}) => {
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col mt-8"
        >
          <Input
            label="Username"
            name="username"
            placeholder="Username"
            validation={{
              required: "Username is required",
              maxLength: {
                value: 20,
                message: "Username must be less than 20 characters",
              },
            }}
          />
          <Input
            label="Email"
            name="email"
            placeholder="Email"
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            }}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            validation={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
          />
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            validation={{
              required: "Confirmation of password is required",
              minLength: {
                value: 8,
                message: "Confirmation password must be at least 8 characters",
              },
            }}
          />
          <Button loading={loading} className="mt-8" type="submit">
            Submit
          </Button>
        </form>
      </FormProvider>
      <Link className="mt-8" handleClick={() => setStep(1)}>
        Already have an account? Login
      </Link>
      <Link className="mt-4" handleClick={() => setStep(3)}>
        Resend email verification
      </Link>
    </>
  );
};

const SignIn: React.FC<FormProps> = ({
  methods,
  onSubmit,
  setStep,
  loading,
}) => {
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col mt-8"
        >
          <Input
            label="Email"
            name="email"
            placeholder="Email"
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            }}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            validation={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
          />
          <Button loading={loading} className="mt-8" type="submit">
            Submit
          </Button>
        </form>
      </FormProvider>
      <Link className="mt-8" handleClick={() => setStep(2)}>
        Don&apos;t have an account? Sign Up
      </Link>
    </>
  );
};

export { ResendVerification, SignIn, SignUp };
