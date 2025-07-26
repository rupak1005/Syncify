import React from "react";

export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-zinc-700/50 rounded ${className}`}
      {...props}
    />
  );
}

export default Skeleton; 