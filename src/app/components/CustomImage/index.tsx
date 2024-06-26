"use client";
import Image, { ImageProps } from "next/image";
import React from "react";

const CustomImage: React.FC<ImageProps> = ({ className, ...rest }) => {
  return (
    <Image
      {...rest}
      className={`rounded-lg mx-auto ${className ?? ""}`}
      alt={rest.alt}
    />
  );
};

export default CustomImage;
