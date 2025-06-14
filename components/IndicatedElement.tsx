import React from "react";
import Loader from "./loader";

type IndicatedElementProps = {
  className?: string;
  content?: React.ReactNode;
  isLoading?: boolean;
};

export default function IndicatedElement({
  className = "w-6 h-6",
  content = "Text",
  isLoading,
}: IndicatedElementProps) {
  return (
    <>
      {!isLoading ? (
        <div className={className}>{content}</div>
      ) : (
        <div className={className}>
          <Loader />
        </div>
      )}
    </>
  );
}
