"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

export function RemoteProductPhoto({
  src,
  name,
  priority = false,
  className = "",
}: {
  src: string;
  name: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="image-fallback"
        role="img"
        aria-label={`${name}: photo unavailable`}
      >
        <ImageOff size={30} strokeWidth={1.2} aria-hidden="true" />
        <span>Photo coming soon</span>
      </div>
    );
  }
  return (
    <Image
      className={className}
      src={src}
      alt={`${name} — illustrative product photograph`}
      fill
      sizes="(max-width: 600px) 50vw, (max-width: 1000px) 40vw, 30vw"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  );
}
