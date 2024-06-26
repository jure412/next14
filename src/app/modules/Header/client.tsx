"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { TiThMenu } from "react-icons/ti";
import { toast } from "react-toastify";
import { getMe, signOut } from "../../actions/auth";
import Button from "../../components/Button";
import { ButtonSize, ButtonVariant } from "../../components/Button/index.types";
import Link from "../../components/Link";
import Modal from "../../components/Modal";
import NextLink from "../../components/NextLink";
import { LinkVariant } from "../../components/NextLink/index.types";
import { pageTour } from "../../helpers/functions/client";
import Authentication from "../ModalContent/Authentication";

const ClientPart: any = ({ getMeData }: any) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["getMe"],
    initialData: getMeData,
    queryFn: () => getMe(),
    staleTime: Infinity,
  });

  const m = useMutation({
    mutationFn: signOut,
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ["getMe"] });
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      if (!data?.success) {
        toast.error(data?.msg?.[0]);
      } else {
        toast.success(data?.msg?.[0]);
        await queryClient.cancelQueries({ queryKey: ["getMe"] });
        queryClient.setQueryData(["getMe"], {
          isAuth: false,
          msg: ["Unauthorized"],
          success: false,
        });
        queryClient.removeQueries({
          queryKey: ["getDrawings"],
        });
        if (pathname !== "/" && pathname !== "/public-page") {
          push("/");
        }
      }
    },
  });

  return (
    <div className="flex gap-8 items-center">
      {!pathname.includes("verify-email") && (
        <Link
          handleClick={() =>
            pageTour({ isAuth: data?.isAuth, pathname: pathname })
          }
        >
          <TbHelpSquareRoundedFilled size={30} />
        </Link>
      )}
      {isMenuOpen ? (
        <IoClose
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size={30}
          className="sm:hidden cursor-pointer"
        />
      ) : (
        <TiThMenu
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size={30}
          className="sm:hidden cursor-pointer"
        />
      )}
      <div
        className={`
          ${
            isMenuOpen
              ? "sm:hidden flex flex-col fixed left-0 top-14 shadow-primary z-20"
              : "hidden sm:flex"
          }
          gap-8
          items-center
          top-14
          w-full
          p-4
          z-14
          bg-background
        `}
        onClick={() => setIsMenuOpen(false)}
      >
        <NextLink
          prefetch={false}
          variant={LinkVariant.SECONDARY}
          href="/public-page"
          scroll={false}
        >
          Public page
        </NextLink>
        {isLoading || m.isPending ? (
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
            <Button
              className="w-full sm:w-auto"
              onClick={() => m.mutate()}
              size={ButtonSize.SMALL}
              variant={ButtonVariant.TERTIARY}
              loading={m.isPending}
            >
              Sign out
            </Button>
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
  );
};

export default ClientPart;
