import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

export function ArrowButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`group relative inline-flex items-center overflow-hidden rounded-[var(--radius)]
        bg-primary px-6 py-3 font-medium text-primary-foreground cursor-pointer
        transition-colors duration-300 hover:opacity-95
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${className}`}
    >
      <span className="transition-transform duration-300 ease-in-out group-hover:-translate-x-2">
        {children}
      </span>
      <ArrowRight
        aria-hidden
        className="absolute right-4 size-4 translate-x-4 opacity-0
          transition-all duration-300 ease-in-out
          group-hover:translate-x-0 group-hover:opacity-100"
      />
      <span aria-hidden className="w-0 transition-all duration-300 ease-in-out group-hover:w-4" />
    </button>
  );
}
