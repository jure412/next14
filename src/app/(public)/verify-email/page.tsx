"use client";
import { verifyEmail } from "@/app/actions/auth";
import Button from "@/app/components/Button";
import Typography from "@/app/components/Typography";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const VerifyEmailPage = ({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) => {
  const { push } = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: verifyEmail,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      if (data.success === false) return toast.error(data.msg[0]);
      toast.success(data.msg[0]);
      push("/");
    },
  });

  return (
    <div className="flex flex-col">
      <Typography h1>Verify Email</Typography>
      <Button
        className="my-5"
        loading={isPending}
        onClick={() => mutate(token)}
      >
        Verify Email
      </Button>
    </div>
  );
};

export default VerifyEmailPage;
