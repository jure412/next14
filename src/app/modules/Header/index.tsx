import React from "react";
import { CiAirportSign1 } from "react-icons/ci";
import { getMe } from "../../actions/auth";
import Container from "../../components/Container";
import NextLink from "../../components/NextLink";
import { LinkVariant } from "../../components/NextLink/index.types";
import ClientPart from "./client";

const Header: React.FC = async () => {
  const getMeData = await getMe();
  return (
    <header className="fixed left-0 z-10 w-full bg-background">
      <Container>
        <div className="h-14 flex items-center justify-between">
          <NextLink
            variant={LinkVariant.PRIMARY}
            href="/"
            prefetch={false}
            scroll={false}
          >
            <CiAirportSign1 size={50} />
          </NextLink>
          <ClientPart getMeData={getMeData} />
        </div>
      </Container>
    </header>
  );
};

export default Header;
