import { cn } from "@/lib/utils";
import Image from "next/image";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="https://i.postimg.cc/T1SXQZZr/Tabd-l.png"
      alt="TabdeelHub Logo"
      width={32}
      height={32}
      className={cn("text-primary", props.className)}
    />
  );
}

export function Wordmark() {
    return (
        <div className="flex justify-center">
            <Image
                src="https://i.postimg.cc/T1SXQZZr/Tabd-l.png"
                alt="TabdeelHub Logo"
                width={140}
                height={40}
            />
        </div>
    );
}

export function HeroWordmark() {
    return (
        <div className="flex justify-center">
            <Image
                src="https://i.postimg.cc/T1SXQZZr/Tabd-l.png"
                alt="TabdeelHub Logo"
                width={280}
                height={80}
                className="drop-shadow-lg"
            />
        </div>
    );
}