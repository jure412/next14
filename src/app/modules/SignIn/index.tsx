import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Link from "@/app/components/Link";
import { FormProvider } from "react-hook-form";
import { FormProps } from "../ModalContent/index.types";

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

export default SignIn;
