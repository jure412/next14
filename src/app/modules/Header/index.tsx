"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { CiAirportSign1 } from "react-icons/ci";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { signOut } from "../../actions/auth";
import Button from "../../components/Button";
import { ButtonSize, ButtonVariant } from "../../components/Button/index.types";
import Modal from "../../components/Modal";
import NextLink from "../../components/NextLink";
import { LinkVariant } from "../../components/NextLink/index.types";
import { getMe } from "../../helpers/queries/index.client";
import Authentication from "../ModalContent/Authentication";

const Header: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => getMe(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signOut,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["getMe"] });
      queryClient.setQueryData(["getMe"], {
        isAuth: false,
        msg: ["Unauthorized"],
        success: false,
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.msg?.[0]);
      } else {
        toast.success(data?.msg?.[0]);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["getMe"] });
    },
  });

  return (
    <header>
      <div className="h-14 flex items-center justify-between">
        <NextLink
          variant={LinkVariant.PRIMARY}
          href="/"
          prefetch={false}
          scroll={false}
        >
          <CiAirportSign1 size={50} />
        </NextLink>
        <div className="flex gap-8 items-center">
          {isLoading ? (
            <FaSpinner size={20} className="spinner-icon animate-spin" />
          ) : data?.data?.user ? (
            <>
              <NextLink
                prefetch={false}
                variant={LinkVariant.SECONDARY}
                href="/drawings"
                scroll={false}
              >
                Drawings
              </NextLink>
              {/* <form action={mutate}> */}
              <Button
                onClick={() => mutate()}
                size={ButtonSize.SMALL}
                variant={ButtonVariant.TERTIARY}
                loading={isPending}
                // type="submit"
              >
                Sign out
              </Button>
              {/* </form> */}
            </>
          ) : (
            <Modal
              linkType={LinkVariant.SECONDARY}
              linkChildren={<AiOutlineLogin size={20} />}
            >
              <Authentication />
            </Modal>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
