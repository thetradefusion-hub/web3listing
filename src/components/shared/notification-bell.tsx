"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markNotificationRead } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/database";

export function NotificationBell({
  userId,
  variant = "default",
}: {
  userId: string;
  variant?: "default" | "agent";
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setNotifications(data || []));
  }, [userId]);

  const unreadCount = notifications.length;
  const isAgent = variant === "agent";

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className={
          isAgent
            ? "relative h-9 w-9 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
            : "relative"
        }
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span
            className={
              isAgent
                ? "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                : "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-black"
            }
          >
            {unreadCount}
          </span>
        )}
      </Button>
      {open && notifications.length > 0 && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={async () => {
                await markNotificationRead(n.id);
                setNotifications((prev) => prev.filter((item) => item.id !== n.id));
              }}
              className="w-full rounded-md p-2 text-left text-sm hover:bg-slate-50"
            >
              <p className="font-medium text-slate-900">{n.title}</p>
              <p className="text-xs text-slate-500">{n.message}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
