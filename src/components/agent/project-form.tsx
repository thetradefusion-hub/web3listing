"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOCKCHAIN_NETWORKS } from "@/lib/constants";
import { toast } from "sonner";
import type { Project } from "@/types/database";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(project?.blockchain_network || "");

  async function handleSubmit(status: string) {
    const formEl = formRef.current;
    if (!formEl) return;

    if (!network) {
      toast.error("Please select a blockchain network");
      return;
    }

    if (!formEl.reportValidity()) return;

    setLoading(true);
    const form = new FormData(formEl);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;
    data.blockchain_network = network;
    data.status = status;

    const result = project
      ? await updateProject(project.id, data)
      : await createProject(data);

    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(status === "draft" ? "Draft saved" : "Project submitted");
    router.push("/agent/projects");
    router.refresh();
  }

  return (
    <form ref={formRef} className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project_name">Project Name *</Label>
          <Input id="project_name" name="project_name" defaultValue={project?.project_name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="token_name">Token Name *</Label>
          <Input id="token_name" name="token_name" defaultValue={project?.token_name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="token_symbol">Token Symbol *</Label>
          <Input id="token_symbol" name="token_symbol" defaultValue={project?.token_symbol} required maxLength={10} />
        </div>
        <div className="space-y-2">
          <Label>Blockchain Network *</Label>
          <Select value={network} onValueChange={(v) => setNetwork(v || "")} required>
            <SelectTrigger><SelectValue placeholder="Select network" /></SelectTrigger>
            <SelectContent>
              {BLOCKCHAIN_NETWORKS.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" name="website_url" type="url" defaultValue={project?.website_url || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contract_address">Contract Address</Label>
          <Input id="contract_address" name="contract_address" defaultValue={project?.contract_address || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="official_email">Official Email</Label>
          <Input id="official_email" name="official_email" type="email" defaultValue={project?.official_email || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input id="logo_url" name="logo_url" defaultValue={project?.logo_url || ""} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="social_telegram">Telegram</Label>
          <Input id="social_telegram" name="social_telegram" defaultValue={project?.social_telegram || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="social_twitter">Twitter/X</Label>
          <Input id="social_twitter" name="social_twitter" defaultValue={project?.social_twitter || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="social_discord">Discord</Label>
          <Input id="social_discord" name="social_discord" defaultValue={project?.social_discord || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="social_medium">Medium</Label>
          <Input id="social_medium" name="social_medium" defaultValue={project?.social_medium || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whitepaper_url">Whitepaper URL</Label>
          <Input id="whitepaper_url" name="whitepaper_url" defaultValue={project?.whitepaper_url || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tokenomics_url">Tokenomics URL</Label>
          <Input id="tokenomics_url" name="tokenomics_url" defaultValue={project?.tokenomics_url || ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="team_info">Team Information</Label>
        <Textarea id="team_info" name="team_info" defaultValue={project?.team_info || ""} rows={3} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          className="rounded-xl border-slate-200"
          onClick={() => handleSubmit("draft")}
        >
          Save Draft
        </Button>
        <Button
          type="button"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:opacity-90"
          onClick={() => handleSubmit("submitted")}
        >
          {loading ? "Saving..." : "Submit Project"}
        </Button>
      </div>
    </form>
  );
}
