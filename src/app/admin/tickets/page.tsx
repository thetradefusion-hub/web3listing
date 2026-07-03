import { createClient } from "@/lib/supabase/server";
import { AdminTicketsUI, type AdminTicketRow } from "@/components/admin/admin-tickets-ui";

function rel<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AdminTicketsPage() {
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from("tickets")
    .select(
      `
      *,
      profiles!tickets_user_id_fkey(full_name, email, role, company_name),
      ticket_messages(
        id,
        ticket_id,
        user_id,
        message,
        attachment_url,
        created_at,
        profiles!ticket_messages_user_id_fkey(full_name, role)
      )
    `
    )
    .order("created_at", { ascending: false });

  const rows: AdminTicketRow[] = (tickets || []).map((ticket) => ({
    ...ticket,
    profiles: rel(ticket.profiles),
    ticket_messages: (ticket.ticket_messages || []).map((msg: AdminTicketRow["ticket_messages"][number]) => ({
      ...msg,
      profiles: rel(msg.profiles),
    })),
  }));

  return <AdminTicketsUI tickets={rows} />;
}
