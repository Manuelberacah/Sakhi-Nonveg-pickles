"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK = "/products/placeholder.svg";

const FallbackImage = ({ src, alt, className = "", fill = false, width, height, priority = false }) => {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK);

  return (
    <Image
      src={imageSrc || FALLBACK}
      alt={alt}
      className={className}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      onError={() => setImageSrc(FALLBACK)}
    />
  );
};

export default FallbackImage;
