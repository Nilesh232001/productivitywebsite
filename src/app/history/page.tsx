import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { HistorySection } from "@/components/history-section";
import { getHistorySnapshots, getSession } from "@/lib/supabase/db";

const defaultRangeDays = 30;

type HistorySearchParams = {
  from?: string;
  to?: string;
};

export default async function HistoryPage({
  searchParams
}: {
  searchParams?: Promise<HistorySearchParams>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  const resolvedParams = await searchParams;
  const { from, to } = resolveHistoryRange(resolvedParams);
  const historySnapshots = await getHistorySnapshots({ from, to });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-5" id="history">
        <section className="rounded-lg border border-line bg-surface p-5 shadow-soft">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-ink">History</h1>
              <p className="text-xs text-ink/55">Filter by date range to review daily performance.</p>
            </div>
            <form className="flex flex-wrap items-end gap-2" method="get">
              <label className="grid gap-1 text-xs font-medium text-ink/60">
                From
                <input
                  className="h-9 rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-forest"
                  defaultValue={from}
                  name="from"
                  type="date"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-ink/60">
                To
                <input
                  className="h-9 rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-forest"
                  defaultValue={to}
                  name="to"
                  type="date"
                />
              </label>
              <button
                className="focus-ring inline-flex h-9 items-center justify-center rounded-md bg-forest px-4 text-sm font-medium text-white"
                type="submit"
              >
                Apply
              </button>
              <a className="text-xs font-medium text-forest" href="/history">
                Reset
              </a>
            </form>
          </div>

          <div className="text-xs text-ink/55">
            Showing {from} to {to}
          </div>
        </section>

        <HistorySection history={historySnapshots} />
      </div>
    </AppShell>
  );
}

function resolveHistoryRange(searchParams?: HistorySearchParams) {
  const today = new Date();
  const to = normalizeDateKey(searchParams?.to) ?? toDateKey(today);
  const fromDefault = new Date(today);
  fromDefault.setDate(fromDefault.getDate() - defaultRangeDays);
  const from = normalizeDateKey(searchParams?.from) ?? toDateKey(fromDefault);

  if (from <= to) {
    return { from, to };
  }

  return { from: to, to: from };
}

function toDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeDateKey(value?: string) {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return value;
}
