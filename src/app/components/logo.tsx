import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6 text-primary", props.className)}
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
      <path d="M12 8V6" />
      <path d="m9 9-1.5 1.5" />
      <path d="M12 16v-2" />
    </svg>
  );
}

export function Wordmark(props: SVGProps<SVGSVGElement>) {
    return (
        <span className="font-headline text-2xl font-bold text-foreground">
            Tabdeel<span className="text-primary">Hub</span>
        </span>
    );
}
