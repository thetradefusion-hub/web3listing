"use client";

import { TELEGRAM_SUPPORT } from "@/lib/constants";
import { buildTelegramLink } from "@/lib/telegram";
import { cn } from "@/lib/utils";

function TelegramPlaneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

export function TelegramChatFab({
  href = TELEGRAM_SUPPORT,
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={buildTelegramLink(href)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on Telegram"
      className={cn(
        "group fixed right-4 bottom-4 z-40 flex items-center sm:right-6 sm:bottom-6",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none mr-0 max-w-0 overflow-hidden whitespace-nowrap rounded-full border border-border/70 bg-card/95 px-0 py-2 text-sm font-semibold text-foreground opacity-0 shadow-lg backdrop-blur-md transition-all duration-300",
          "group-hover:mr-3 group-hover:max-w-[12rem] group-hover:px-3.5 group-hover:opacity-100",
          "group-focus-visible:mr-3 group-focus-visible:max-w-[12rem] group-focus-visible:px-3.5 group-focus-visible:opacity-100"
        )}
      >
        Chat on Telegram
      </span>

      <span className="relative flex size-[3.6rem] items-center justify-center">
        <span
          className="absolute inset-[6%] animate-ping rounded-[1.1rem] bg-[#2AABEE]/35 [animation-duration:2.4s]"
          aria-hidden
        />
        <span
          className={cn(
            "relative flex size-[3.6rem] items-center justify-center rounded-[1.2rem]",
            "bg-[#2AABEE] text-white",
            "shadow-[0_10px_28px_-6px_rgba(42,171,238,0.7)]",
            "ring-1 ring-white/30 transition duration-300",
            "group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:shadow-[0_14px_34px_-6px_rgba(42,171,238,0.85)]",
            "group-active:scale-95"
          )}
        >
          <TelegramPlaneIcon className="size-7 translate-x-px -translate-y-px" />
        </span>
        <span
          className="absolute right-0.5 top-0.5 size-3.5 rounded-full border-2 border-background bg-[#a3e635]"
          title="Online"
          aria-hidden
        />
      </span>
    </a>
  );
}
