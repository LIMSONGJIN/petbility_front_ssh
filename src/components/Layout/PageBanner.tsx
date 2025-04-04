import React from "react";
import classNames from "classnames";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
}

export default function PageBanner({
  title,
  subtitle,
  backgroundImage,
  className,
}: PageBannerProps) {
  return (
    <div
      className={classNames(
        "relative w-full h-48 flex items-center justify-center text-center text-white",
        className
      )}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl font-medium drop-shadow-sm">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
