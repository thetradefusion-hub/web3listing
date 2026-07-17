"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ImageUrlPreview({
  id,
  name,
  defaultValue,
  placeholder,
  className,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  const [url, setUrl] = useState((defaultValue || "").trim());
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Input
        id={id}
        name={name}
        className={className}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => {
          setUrl(e.target.value.trim());
          setFailed(false);
        }}
      />
      {url ? (
        <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
          {failed ? (
            <p className="p-3 text-xs text-muted-foreground">Couldn&apos;t load a preview for this URL.</p>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt="Preview"
              className="max-h-64 w-full object-contain"
              loading="lazy"
              onError={() => setFailed(true)}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
