import { SERVICE_CATEGORIES, type ServiceCategoryBlock } from "@/lib/home-content";
import { CheckCircle2 } from "lucide-react";

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 sm:rounded-xl sm:p-4">
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400 sm:mb-3 sm:text-[11px]">
        {title}
      </p>
      <ul className="space-y-1.5 sm:space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-slate-400 sm:text-sm">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/80" />
            <span>{item}</span>
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
    <section className="border-b border-white/[0.06] py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="lh-label text-cyan-400">Full catalog</p>
          <h2 className="lh-display mt-3 text-white sm:mt-4">Everything your Web3 project needs</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:mt-5 sm:text-base lg:text-lg">
            From token launch to global growth — explore every service category in detail.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const columns = getDetailColumns(cat);

            return (
              <article
                key={cat.title}
                className="overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-4 transition-colors hover:border-cyan-500/15 sm:rounded-2xl sm:p-6 lg:p-8"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
                  <div className="lg:w-[34%] lg:shrink-0">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-400 ring-1 ring-white/10 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white sm:text-xl lg:text-2xl">{cat.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:mt-3">{cat.description}</p>
                  </div>

                  <div
                    className={`grid flex-1 gap-3 sm:gap-4 ${
                      columns.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
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
