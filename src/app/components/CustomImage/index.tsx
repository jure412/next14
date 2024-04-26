import Image, { ImageProps } from "next/image";
import React from "react";

const CustomImage: React.FC<ImageProps> = ({ className, alt, ...rest }) => {
  return (
    <Image
      {...rest}
      alt={alt}
      className={`rounded-lg mx-auto ${className ?? ""}`}
    />
  );
};

export default CustomImage;
