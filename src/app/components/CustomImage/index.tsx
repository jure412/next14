"use client";
import Image, { ImageProps } from "next/image";
import React, { useState } from "react";

const CustomImage: React.FC<ImageProps> = ({ className, alt, ...rest }) => {
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <Image
      {...rest}
      alt={alt}
      className={`rounded-lg mx-auto ${className ?? ""} ${
        isImageLoading ? "blur-sm" : ""
      }`}
      onLoad={() => setImageLoading(false)}
    />
  );
};

export default CustomImage;
