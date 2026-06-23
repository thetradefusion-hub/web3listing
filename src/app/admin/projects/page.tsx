import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminEmptyState,
  AdminBadge,
  AdminFilterPill,
  projectStatusVariant,
  rel,
} from "@/components/admin/ui";
import {
  MobileDataCard,
  MobileDataRow,
  ResponsiveTableShell,
} from "@/components/shared/responsive-table";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "submitted", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Draft" },
] as const;

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*, profiles!projects_agent_id_fkey(full_name, email, company_name)")
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data: projects } = await query;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Project Review"
        description="Review agent-submitted token projects before they can place orders"
      />

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <AdminFilterPill
            key={f.value || "all"}
            href={f.value ? `/admin/projects?status=${f.value}` : "/admin/projects"}
            active={statusFilter === f.value || (!statusFilter && f.value === "")}
          >
            {f.label}
          </AdminFilterPill>
        ))}
      </div>

      {projects && projects.length > 0 ? (
        <AdminPanel className="overflow-hidden">
          <ResponsiveTableShell
            table={
              <table className="portal-table w-full">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th className="hidden md:table-cell">Token</th>
                    <th className="hidden lg:table-cell">Network</th>
                    <th className="hidden lg:table-cell">Agent</th>
                    <th>Status</th>
                    <th className="hidden sm:table-cell">Submitted</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => {
                    const agent = rel(project.profiles);
                    return (
                      <tr key={project.id}>
                        <td className="font-medium text-[#0F172A]">{project.project_name}</td>
                        <td className="hidden text-[#64748B] md:table-cell">
                          {project.token_name} ({project.token_symbol})
                        </td>
                        <td className="hidden text-[#64748B] lg:table-cell">{project.blockchain_network}</td>
                        <td className="hidden text-[#64748B] lg:table-cell">
                          {agent?.full_name || agent?.email || "—"}
                        </td>
                        <td>
                          <AdminBadge variant={projectStatusVariant(project.status)}>{project.status}</AdminBadge>
                        </td>
                        <td className="hidden text-[#94A3B8] sm:table-cell">
                          {new Date(project.created_at).toLocaleDateString()}
                        </td>
                        <td className="text-right">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="text-sm font-medium text-[#635BFF] hover:underline"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            }
            mobile={
              <>
                {projects.map((project) => {
                  const agent = rel(project.profiles);
                  return (
                    <MobileDataCard key={project.id} href={`/admin/projects/${project.id}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#0F172A]">{project.project_name}</p>
                          <p className="mt-1 text-sm text-[#64748B]">
                            {project.token_symbol} · {project.blockchain_network}
                          </p>
                        </div>
                        <AdminBadge variant={projectStatusVariant(project.status)}>{project.status}</AdminBadge>
                      </div>
                      <div className="mt-4 border-t border-[#F1F5F9] pt-4">
                        <MobileDataRow label="Agent">{agent?.full_name || agent?.email || "—"}</MobileDataRow>
                        <MobileDataRow label="Submitted">
                          {new Date(project.created_at).toLocaleDateString()}
                        </MobileDataRow>
                      </div>
                    </MobileDataCard>
                  );
                })}
              </>
            }
          />
        </AdminPanel>
      ) : (
        <AdminEmptyState
          title="No projects found"
          description={
            statusFilter === "submitted"
              ? "No projects are waiting for review right now."
              : "Agent project submissions will appear here."
          }
        />
      )}
    </AdminPageShell>
  );
}
