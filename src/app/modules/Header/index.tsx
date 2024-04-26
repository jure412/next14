"use client";
import Button from "@/app/components/Button";
import { ButtonSize, ButtonVariant } from "@/app/components/Button/index.types";
import { LinkVariant } from "@/app/components/Link/index.types";
import Modal from "@/app/components/Modal";
import NextLink from "@/app/components/NextLink";
import { getMe } from "@/app/helpers/queries/index.client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { CiAirportSign1 } from "react-icons/ci";
import { FaSpinner } from "react-icons/fa";
import { signOut } from "../../../../actions/auth";
import Authentication from "../ModalContent/Authentication";

const Header: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => getMe(),
  });

  const handleSingOut = async () => {
    await signOut();
    queryClient.invalidateQueries({ queryKey: ["getMe"] });
  };

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
              <form action={handleSingOut}>
                <Button
                  size={ButtonSize.SMALL}
                  variant={ButtonVariant.TERTIARY}
                  type="submit"
                >
                  Sign out
                </Button>
              </form>
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
