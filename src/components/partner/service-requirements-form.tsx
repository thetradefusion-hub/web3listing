"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getProjectPrefillValue,
  inferRequirementFieldType,
  type RequirementFieldType,
} from "@/lib/service-requirements";
import type { Project } from "@/types/database";
import { cn } from "@/lib/utils";

type ServiceRequirementsFormProps = {
  requiredDocuments: string[];
  selectedProject?: Project | null;
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  notes?: string;
  onNotesChange?: (notes: string) => void;
  showNotes?: boolean;
  comfortable?: boolean;
  disabled?: boolean;
};

function fieldId(label: string, index: number) {
  return `req-${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function RequirementInput({
  type,
  id,
  value,
  onChange,
  disabled,
  className,
}: {
  type: RequirementFieldType;
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  if (type === "textarea") {
    return (
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        className={cn("resize-y rounded-xl", className)}
      />
    );
  }

  return (
    <Input
      id={id}
      type={type === "number" ? "number" : type === "email" ? "email" : type === "url" ? "url" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={className}
      inputMode={type === "number" ? "numeric" : undefined}
    />
  );
}

export function ServiceRequirementsForm({
  requiredDocuments,
  selectedProject,
  values,
  onChange,
  notes = "",
  onNotesChange,
  showNotes = true,
  comfortable = false,
  disabled,
}: ServiceRequirementsFormProps) {
  const fieldTypes = useMemo(
    () => requiredDocuments.map((label) => inferRequirementFieldType(label)),
    [requiredDocuments]
  );

  useEffect(() => {
    if (!selectedProject) return;

    const next = { ...values };
    let changed = false;

    for (const label of requiredDocuments) {
      if (!next[label]?.trim()) {
        const prefill = getProjectPrefillValue(label, selectedProject);
        if (prefill) {
          next[label] = prefill;
          changed = true;
        }
      }
    }

    if (changed) onChange(next);
  }, [selectedProject?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (requiredDocuments.length === 0) return null;

  const inputClass = comfortable ? "h-11 rounded-xl" : "h-10 rounded-xl";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Service requirements</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Complete each field below. Matching project details are filled automatically when available.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {requiredDocuments.map((label, index) => (
          <div
            key={label}
            className={cn("space-y-2", fieldTypes[index] === "textarea" && "sm:col-span-2")}
          >
            <Label htmlFor={fieldId(label, index)} className="text-xs font-semibold text-muted-foreground">
              {label} *
            </Label>
            <RequirementInput
              type={fieldTypes[index]}
              id={fieldId(label, index)}
              value={values[label] || ""}
              onChange={(value) => onChange({ ...values, [label]: value })}
              disabled={disabled}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      {showNotes ? (
        <div className="space-y-2">
          <Label htmlFor="service-requirement-notes" className="text-xs font-semibold text-muted-foreground">
            Additional notes (optional)
          </Label>
          <Textarea
            id="service-requirement-notes"
            value={notes}
            onChange={(e) => onNotesChange?.(e.target.value)}
            disabled={disabled}
            rows={3}
            placeholder="Any extra instructions for this order..."
            className="resize-y rounded-xl"
          />
        </div>
      ) : null}
    </div>
  );
}

export function useServiceRequirementValues(requiredDocuments: string[]) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(requiredDocuments.map((label) => [label, ""]))
  );
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setValues((current) => {
      const next: Record<string, string> = {};
      for (const label of requiredDocuments) {
        next[label] = current[label] || "";
      }
      return next;
    });
  }, [requiredDocuments]);

  return { values, setValues, notes, setNotes };
}
