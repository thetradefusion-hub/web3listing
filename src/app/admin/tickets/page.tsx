import { createClient } from "@/lib/supabase/server";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelBody,
  AdminBadge,
  AdminEmptyState,
  rel,
} from "@/components/admin/ui";

function ticketVariant(status: string): "success" | "warning" | "info" | "muted" {
  if (status === "closed") return "muted";
  if (status === "in_progress") return "info";
  return "warning";
}

export default async function AdminTicketsPage() {
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, profiles!tickets_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Support Tickets"
        description="Manage agent support requests"
      />

      {tickets && tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const profile = rel(ticket.profiles);
            return (
              <AdminPanel key={ticket.id}>
                <AdminPanelBody>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{ticket.subject}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {profile?.full_name || profile?.email} · {new Date(ticket.created_at).toLocaleString()}
                      </p>
                    </div>
                    <AdminBadge variant={ticketVariant(ticket.status)}>{ticket.status.replace(/_/g, " ")}</AdminBadge>
                  </div>
                </AdminPanelBody>
              </AdminPanel>
            );
          })}
        </div>
      ) : (
        <AdminEmptyState title="No tickets" description="Support tickets from agents will appear here." />
      )}
    </AdminPageShell>
  );
}
