"use client";

import { useState } from "react";
import { CheckCircle2, FileUp, Loader2, Upload } from "lucide-react";
import { getKycDocumentSignedUrl, uploadKycDocument } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

type KycFileUploadProps = {
  name: string;
  field: "identity" | "selfie" | "company" | "tax";
  label: string;
  defaultPath?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

function fileLabelFromPath(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1] || "Uploaded file";
}

export function KycFileUpload({
  name,
  field,
  label,
  defaultPath = "",
  disabled,
  required,
  className,
}: KycFileUploadProps) {
  const [path, setPath] = useState(defaultPath);
  const [fileName, setFileName] = useState(defaultPath ? fileLabelFromPath(defaultPath) : "");
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);

    const result = await uploadKycDocument(formData);
    setUploading(false);
    event.target.value = "";

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setPath(result.path || "");
    setFileName(file.name);
    toast.success(`${label} uploaded`);
  }

  async function handleView() {
    if (!path) return;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      window.open(path, "_blank", "noopener,noreferrer");
      return;
    }

    const result = await getKycDocumentSignedUrl(path);
    if (result.error || !result.url) {
      toast.error(result.error || "Could not open document");
      return;
    }
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="text-xs font-semibold text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </Label>

      <input type="hidden" name={name} value={path} />

      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-5 text-center transition-colors",
          !disabled && "hover:border-primary/40 hover:bg-muted/30",
          disabled && "cursor-not-allowed opacity-60",
          path && "border-chart-2/40 bg-chart-2/5"
        )}
      >
        <input
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled || uploading}
          onChange={handleFileChange}
        />
        {uploading ? (
          <Loader2 className="size-5 animate-spin text-primary" />
        ) : path ? (
          <CheckCircle2 className="size-5 text-chart-2" />
        ) : (
          <Upload className="size-5 text-muted-foreground" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {uploading ? "Uploading..." : path ? "File uploaded" : "Click to upload"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            JPG, PNG, WEBP, or PDF · Max 10 MB
          </p>
          {fileName ? (
            <p className="mt-1 truncate text-xs font-medium text-primary">{fileName}</p>
          ) : null}
        </div>
      </label>

      {path ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-fit rounded-lg text-xs"
          onClick={handleView}
        >
          <FileUp data-icon="inline-start" />
          View uploaded file
        </Button>
      ) : null}
    </div>
  );
}
