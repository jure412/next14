"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import Link from "../Link";
import { LinkVariant } from "../Link/index.types";

export default function Modal({
  id,
  linkType,
  linkChildren,
  children,
}: React.PropsWithChildren<{
  id?: string;
  linkChildren: React.ReactNode;
  linkType: LinkVariant;
}>) {
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [header, setHeader] = React.useState(null);

  React.useEffect(() => setMounted(true), []);

  const modal =
    mounted && isOpen
      ? createPortal(
          <div className="fixed top-1 w-screen flex items-center justify-center h-screen bg-primary-light/75">
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-primary transform transition-all sm:max-w-lg w-full mx-6">
              <Link
                className="absolute right-6 top-6"
                handleClick={() => setIsOpen(false)}
              >
                <AiOutlineClose />
              </Link>
              <div className="flex items-end pt-6 pl-6 gap-8 pr-14">
                {header}
              </div>
              <div className="p-6">
                {React.cloneElement(children as React.ReactElement, {
                  isOpen,
                  setIsOpen,
                  setHeader,
                })}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div id={id ?? ""}>
        <Link variant={linkType} handleClick={() => setIsOpen(true)}>
          {linkChildren}
        </Link>
      </div>
      {modal}
    </>
  );
}
