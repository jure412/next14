import Modal from "@/app/components/Modal";
import { LinkVariant } from "@/app/components/Modal/index.types";
import Typography from "@/app/components/Typography";
import React from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { CiAirportSign1 } from "react-icons/ci";
import Authentication from "../ModalContent/Authentication";

const Header: React.FC = () => {
  return (
    <header>
      <div className="container mx-auto px-4 h-13 flex items-center justify-between">
        <CiAirportSign1 size={50} className="text-primary-dark" />
        <Modal
          linkType={LinkVariant.SECONDARY}
          HeaderChildren={
            <>
              <AiOutlineLogin className="text-primary-dark" size={40} />
              <Typography h2>Login</Typography>
            </>
          }
          linkChildren={<AiOutlineLogin size={20} />}
        >
          <Authentication />
        </Modal>
      </div>
    </header>
  );
};

export default Header;
