import Button from "@/app/components/Button";
import { ButtonSize, ButtonVariant } from "@/app/components/Button/index.types";
import { LinkVariant } from "@/app/components/Link/index.types";
import Modal from "@/app/components/Modal";
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
      <div className="container mx-auto px-4 h-13 flex items-center justify-between">
        <CiAirportSign1 size={50} className="text-primary-dark" />
        {user ? (
          <form action={signOut}>
            <Button
              size={ButtonSize.SMALL}
              variant={ButtonVariant.TERTIARY}
              type="submit"
            >
              Sign out
            </Button>
          </form>
        ) : (
          <Modal
            linkType={LinkVariant.SECONDARY}
            linkChildren={<AiOutlineLogin size={20} />}
          >
            <Authentication />
          </Modal>
        )}
      </div>
    </header>
  );
};

export default Header;
