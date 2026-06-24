import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mjs", ".json"]);

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "package-lock.json"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (EXT.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const replacements = [
  ["@/components/agent/", "@/components/partner/"],
  ["/admin/agents", "/admin/partners"],
  ["/agent/", "/partner/"],
  ['"/agent"', '"/partner"'],
  ["'/agent'", "'/partner'"],
  ["`'/agent", "`'/partner"],
  ["Agent Portal", "Partner Portal"],
  ["Agent Login", "Partner Login"],
  ["Agent Management", "Partner Management"],
  ["Agent Dashboard", "Partner Dashboard"],
  ["Agent workspace", "Partner workspace"],
  ["Agent Commission", "Partner Commission"],
  ["agent commission", "partner commission"],
  ["Web3 Agent Program", "Web3 Partner Program"],
  ["Become an agent", "Become a partner"],
  ["agent portal", "partner portal"],
  ["Agent earnings", "Partner earnings"],
  ["Total Agents", "Total Partners"],
  ["Agent Details", "Partner Details"],
  ["Create Agent Account", "Create Partner Account"],
  ["Agent Created", "Partner Created"],
  ["Agent created successfully", "Partner created successfully"],
  ["Agent not found", "Partner not found"],
  ["Agent ko ye", "Partner ko ye"],
  ["No agents yet", "No partners yet"],
  ["first agent account", "first partner account"],
  ["B2B agent accounts", "B2B partner accounts"],
  ["all agent orders", "all partner orders"],
  ["agent orders", "partner orders"],
  ["agent payment", "partner payment"],
  ["An agent places", "A partner places"],
  ["Agent places", "Partner places"],
  ["Agent uploads", "Partner uploads"],
  ["from agents", "from partners"],
  ["agents will", "partners will"],
  ["agents pending", "partners pending"],
  ["agent support", "partner support"],
  ["agent delivery page", "partner delivery page"],
  ["agent delivery", "partner delivery"],
  ["agent accounts", "partner accounts"],
  ["agent performance", "partner performance"],
  ["let the agent", "let the partner"],
  ["what the agent", "what the partner"],
  ["agent-policy", "partner-policy"],
  ["agent dashboard", "partner dashboard"],
  ['variant="agent"', 'variant="partner"'],
  ["variant: \"agent\"", "variant: \"partner\""],
  ["isAgentRoute", "isPartnerRoute"],
  ["agent-portal", "partner-portal"],
  ["AgentPageShell", "PartnerPageShell"],
  ["AgentPageHeader", "PartnerPageHeader"],
  ["AgentPrimaryButton", "PartnerPrimaryButton"],
  ["AgentSecondaryButton", "PartnerSecondaryButton"],
  ["AgentPanelHeader", "PartnerPanelHeader"],
  ["AgentPanelBody", "PartnerPanelBody"],
  ["AgentEmptyState", "PartnerEmptyState"],
  ["AgentStatCard", "PartnerStatCard"],
  ["AgentFilterPill", "PartnerFilterPill"],
  ["AgentListRow", "PartnerListRow"],
  ["AgentBadge", "PartnerBadge"],
  ["AgentPanel", "PartnerPanel"],
  ["AgentPortalShell", "PartnerPortalShell"],
  ["AgentPortalInner", "PartnerPortalInner"],
  ["AgentMobileDrawer", "PartnerMobileDrawer"],
  ["AgentSidebar", "PartnerSidebar"],
  ["AgentHeader", "PartnerHeader"],
  ["AgentDashboardView", "PartnerDashboardView"],
  ["AgentOrderDetailView", "PartnerOrderDetailView"],
  ["AgentOrderDeliveryPage", "PartnerOrderDeliveryPage"],
  ["AgentActions", "PartnerActions"],
  ["CreateAgentDialog", "CreatePartnerDialog"],
  ["AdminAgentsPage", "AdminPartnersPage"],
  ["totalAgents", "totalPartners"],
  ["agentsTrend", "partnersTrend"],
  ["agentCount", "partnerCount"],
  ["agentsWithCreated", "partnersWithCreated"],
  ["agentsCurrent", "partnersCurrent"],
  ["agentsPrev", "partnersPrev"],
  ["{ data: agents }", "{ data: partners }"],
  ["agents &&", "partners &&"],
  ["agents.map", "partners.map"],
  ["agents.length", "partners.length"],
  ["(agent)", "(partner)"],
  ["(agent ", "(partner "],
  [" agent)", " partner)"],
  [" agent,", " partner,"],
  [" agent.", " partner."],
  [" agent?", " partner?"],
  [" agent:", " partner:"],
  [" agent ", " partner "],
  [" agent\n", " partner\n"],
  ["label: \"Agents\"", "label: \"Partners\""],
  ["href: \"/admin/agents\"", "href: \"/admin/partners\""],
  ["Registered", "Registered"], // noop guard
];

function apply(content) {
  let out = content;
  for (const [from, to] of replacements) {
    out = out.split(from).join(to);
  }
  // Restore protected tokens accidentally changed
  out = out.replace(/partner_id/g, "agent_id");
  out = out.replace(/\.eq\("role", "partner"\)/g, '.eq("role", "agent")');
  out = out.replace(/role === "partner"/g, 'role === "agent"');
  out = out.replace(/role: "partner"/g, 'role: "agent"');
  out = out.replace(/UserPartner/g, "UserAgent");
  out = out.replace(/userPartner/g, "userAgent");
  out = out.replace(/totalPartnersWithCreated/g, "totalAgentsWithCreated");
  return out;
}

const files = walk(ROOT).filter((f) => !f.includes("node_modules"));
let changed = 0;
for (const file of files) {
  if (file.includes("rename-agent-to-partner.mjs")) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = apply(before);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed++;
  }
}

console.log(`Updated ${changed} files`);
