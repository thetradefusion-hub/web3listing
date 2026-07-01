import { SERVICE_CATEGORIES, type ServiceCategoryBlock } from "@/lib/home-content";
import { CheckCircle2 } from "lucide-react";
import { HomeSectionHeader } from "@/components/public/home/section-header";

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-muted/30 p-3.5 sm:rounded-xl sm:p-4">
      <p className="lh-accent mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] sm:mb-3 sm:text-[11px] sm:tracking-[0.16em]">
        {title}
      </p>
      <ul className="space-y-1.5 sm:space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground sm:text-sm">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-chart-2" />
            <span className="min-w-0 break-words leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getDetailColumns(cat: ServiceCategoryBlock) {
  const cols: { title: string; items: string[] }[] = [];
  if (cat.ecosystems) cols.push({ title: "Supported Ecosystems", items: cat.ecosystems });
  if (cat.publications) cols.push({ title: "Publication Network", items: cat.publications });
  if (cat.includes) cols.push({ title: "Includes", items: cat.includes });
  if (cat.features) cols.push({ title: "Features", items: cat.features });
  if (cat.services) cols.push({ title: "Services", items: cat.services });
  if (cat.solutions) cols.push({ title: "Solutions", items: cat.solutions });
  return cols;
}

export function ServiceShowcase() {
  return (
    <section className="landing-section border-b border-border">
      <div className="landing-container">
        <HomeSectionHeader
          label="Full catalog"
          title="Everything your Web3 project needs"
          description="From token launch to global growth — explore every service category in detail."
          className="mb-8 sm:mb-14"
        />

        <div className="space-y-3 sm:space-y-5">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const columns = getDetailColumns(cat);

            return (
              <article
                key={cat.title}
                className="overflow-hidden rounded-xl border border-border bg-card/50 p-4 transition-colors hover:border-primary/30 sm:rounded-2xl sm:p-6 lg:p-8"
              >
                <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
                  <div className="min-w-0 lg:w-[34%] lg:shrink-0">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-chart-2/20 text-primary ring-1 ring-border sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl dark:text-chart-2">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground sm:text-xl lg:text-2xl">{cat.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3">{cat.description}</p>
                  </div>

                  <div
                    className={`grid min-w-0 flex-1 gap-3 sm:gap-4 ${
                      columns.length > 1 ? "md:grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {columns.map((col) => (
                      <ListBlock key={col.title} title={col.title} items={col.items} />
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
