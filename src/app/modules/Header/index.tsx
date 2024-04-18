import Button from "@/app/components/Button";
import { ButtonSize, ButtonVariant } from "@/app/components/Button/index.types";
import { LinkVariant } from "@/app/components/Link/index.types";
import Modal from "@/app/components/Modal";
import NextLink from "@/app/components/NextLink";
import React from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { CiAirportSign1 } from "react-icons/ci";
import { signOut } from "../../../../actions/auth";
import { validateRequest } from "../../../../utils/auth";
import Authentication from "../ModalContent/Authentication";

const Header: React.FC = async () => {
  const { user } = await validateRequest();
  return (
    <header>
      <div className="h-13 flex items-center justify-between">
        <NextLink variant={LinkVariant.PRIMARY} href="/">
          <CiAirportSign1 size={50} />
        </NextLink>
        <div className="flex gap-8 items-center">
          {user ? (
            <>
              <NextLink variant={LinkVariant.SECONDARY} href="/drawings">
                Drawings
              </NextLink>
              <NextLink variant={LinkVariant.SECONDARY} href="/protected">
                Protected
              </NextLink>
              <form action={signOut}>
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
