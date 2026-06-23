import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProjectReviewer } from "@/components/admin/admin-actions";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelHeader,
  AdminPanelBody,
  AdminBadge,
  projectStatusVariant,
  rel,
} from "@/components/admin/ui";

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, profiles!projects_agent_id_fkey(full_name, email, company_name, telegram_username)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const agent = rel(project.profiles);

  const detailFields: [string, string | null | undefined][] = [
    ["Token Name", project.token_name],
    ["Token Symbol", project.token_symbol],
    ["Blockchain", project.blockchain_network],
    ["Contract Address", project.contract_address],
    ["Website", project.website_url],
    ["Official Email", project.official_email],
    ["Logo URL", project.logo_url],
    ["Whitepaper", project.whitepaper_url],
    ["Tokenomics", project.tokenomics_url],
    ["Telegram", project.social_telegram],
    ["Twitter/X", project.social_twitter],
    ["Discord", project.social_discord],
    ["Medium", project.social_medium],
    ["GitHub", project.social_github],
  ];

  return (
    <AdminPageShell className="mx-auto max-w-4xl">
      <AdminPageHeader
        title={project.project_name}
        description={`Submitted by ${agent?.full_name || agent?.email || "Unknown agent"}`}
        badge={<AdminBadge variant={projectStatusVariant(project.status)}>{project.status}</AdminBadge>}
      />

      <div className="space-y-4">
        <AdminPanel>
          <AdminPanelHeader title="Agent Details" />
          <AdminPanelBody className="grid gap-3 md:grid-cols-2">
            {[
              ["Name", agent?.full_name],
              ["Email", agent?.email],
              ["Company", agent?.company_name],
              ["Telegram", agent?.telegram_username],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{value || "—"}</p>
              </div>
            ))}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Project Information" />
          <AdminPanelBody className="grid gap-3 md:grid-cols-2">
            {detailFields.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {value ? (
                    label.includes("URL") || label === "Website" || label === "Whitepaper" || label === "Tokenomics" ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                        {value}
                      </a>
                    ) : (
                      value
                    )
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            ))}
          </AdminPanelBody>
        </AdminPanel>

        {project.team_info && (
          <AdminPanel>
            <AdminPanelHeader title="Team Information" />
            <AdminPanelBody>
              <p className="whitespace-pre-wrap text-sm text-slate-600">{project.team_info}</p>
            </AdminPanelBody>
          </AdminPanel>
        )}

        {project.status === "submitted" && (
          <AdminPanel>
            <AdminPanelHeader title="Review Actions" description="Approve to let the agent place orders for this project" />
            <AdminPanelBody>
              <ProjectReviewer projectId={project.id} />
            </AdminPanelBody>
          </AdminPanel>
        )}

        <Link href="/admin/projects" className="inline-block text-sm font-medium text-violet-600 hover:underline">
          ← Back to all projects
        </Link>
      </div>
    </AdminPageShell>
  );
}
