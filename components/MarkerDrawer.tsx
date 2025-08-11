import { FC, useEffect, useMemo, useState } from 'react';
import { CoffeeReportObject, MarkerData } from '@/types/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import AddCoffeeReport from './AddCoffeeReport';
import { Rating } from './ui/rating';
import { CoffeeMilkType, CoffeeSize, CoffeeType } from '@/types/coffeeTypes';
import { getReportsByVenueId } from '@/actions/report';
import { getRatingColor } from '@/utils/ratingColors';

interface MarkerDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  marker: MarkerData | null;
  selectedCoffeeType: {
    coffeeType: CoffeeType;
    coffeeSize: CoffeeSize;
    coffeeMilkType: CoffeeMilkType;
  };
}

const getAvgRating = (reports: CoffeeReportObject[]) => {
  if (reports.length === 0) return 0;
  const validReports = reports.filter((report) => report.rating != null);
  if (validReports.length === 0) return 0;
  const totalRating = validReports.reduce(
    (acc, report) => acc + (report.rating || 0),
    0
  );
  return totalRating / validReports.length;
};

const MarkerDrawer: FC<MarkerDrawerProps> = ({
  isOpen,
  onOpenChange,
  marker,
  selectedCoffeeType,
}) => {
  const [reports, setReports] = useState<CoffeeReportObject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (isOpen && marker?.venue_id) {
      setLoading(true);
      const getReports = async () => {
        const res = await getReportsByVenueId(marker.venue_id);
        if (cancelled) return;
        if (res.error) {
          console.error('Error fetching reports:', res.error);
        } else if (res.reports) {
          setReports(res.reports);
        }
        setLoading(false);
      };
      getReports();
    }
    return () => {
      cancelled = true;
    };
  }, [marker?.venue_id, isOpen]);

  // marker may be null; UI guards handle that below

  // Derived UI data
  const avgRating = useMemo(() => getAvgRating(reports) || 0, [reports]);
  const reportCount = reports.length;

  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // 1..5
    for (const r of reports) {
      const v = r?.rating;
      if (typeof v === 'number' && v > 0) {
        const idx = Math.min(5, Math.max(1, Math.round(v))) - 1;
        counts[idx] += 1;
      }
    }
    return counts;
  }, [reports]);

  const priceValues = useMemo(() => {
    const vals = reports
      .map((r) => (typeof r.price === 'number' ? r.price : null))
      .filter((v): v is number => v != null);
    return vals;
  }, [reports]);

  const priceStats = useMemo(() => {
    if (!priceValues.length) return null;
    const min = Math.min(...priceValues);
    const max = Math.max(...priceValues);
    const avg = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
    return { min, max, avg };
  }, [priceValues]);

  // Helpers
  const toDate = (d: Date | string | number | null | undefined): Date | null => {
    if (!d) return null;
    const n = new Date(d);
    return isNaN(n.getTime()) ? null : n;
  };

  const timeAgo = (date: Date | null): string => {
    if (!date) return '';
    const diff = Date.now() - date.getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return 'just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    if (day < 30) return `${day}d ago`;
    const mo = Math.floor(day / 30);
    if (mo < 12) return `${mo}mo ago`;
    const yr = Math.floor(mo / 12);
    return `${yr}y ago`;
  };

  const lastUpdated = useMemo(() => {
    const times = reports
      .map((r) => toDate(r.created_at)?.getTime() ?? null)
      .filter((n): n is number => n != null && !isNaN(n));
    if (!times.length) return null;
    return new Date(Math.max(...times));
  }, [reports]);

  const mostRecentReport = useMemo(() => {
    const sorted = [...reports].sort((a, b) => {
      const da = toDate(a.created_at)?.getTime() ?? 0;
      const db = toDate(b.created_at)?.getTime() ?? 0;
      return db - da;
    });
    return sorted[0] || null;
  }, [reports]);

  const avgRatingColor = useMemo(() => getRatingColor(avgRating || 0), [avgRating]);

  const mostCommonRating = useMemo(() => {
    let best = 0;
    let star = 0;
    ratingCounts.forEach((c, i) => {
      if (c > best) {
        best = c;
        star = i + 1;
      }
    });
    return best > 0 ? star : null;
  }, [ratingCounts]);

  // Mini price trend (last 8 prices by created_at)
  const recentPrices = useMemo(() => {
    const withDate = reports
      .map((r) => ({
        price: typeof r.price === 'number' ? r.price : null,
        date: toDate(r.created_at)?.getTime() ?? 0,
      }))
      .filter((x) => x.price != null && x.date > 0) as { price: number; date: number }[];
    const sorted = withDate.sort((a, b) => a.date - b.date).slice(-8);
    const prices = sorted.map((x) => x.price);
    if (!prices.length) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { prices, min, max };
  }, [reports]);

  const coffeeSummary = `${selectedCoffeeType.coffeeType} • ${selectedCoffeeType.coffeeSize} • ${selectedCoffeeType.coffeeMilkType}`;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="
          flex h-full w-[400px] max-w-[92vw] flex-col
          bg-gradient-to-b from-white/10 to-white/[0.04]
          backdrop-blur-xl border-l border-white/20
          text-white
        "
      >
        {/* Sticky header */}
  <SheetHeader className="sticky top-0  px-4 py-3 border-b border-white/15 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-white flex items-center gap-2">
                <span className="inline-block text-lg">☕</span>
                {marker?.venue_name ?? 'Venue'}
              </SheetTitle>
              <SheetDescription className="text-white/80 font-medium">
                {coffeeSummary}
              </SheetDescription>
            </div>
            {!loading && reportCount > 0 && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                style={{ backgroundColor: `${avgRatingColor}20`, color: avgRatingColor }}
                aria-label={`Average rating ${avgRating.toFixed(1)} out of 5`}
              >
              </span>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
          {/* Rating summary */}
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-white/60">
                  Average rating
                </div>
                {loading ? (
                  <div className="mt-2 h-7 w-24 rounded bg-white/20 animate-pulse" />
                ) : (
                  <div className="flex items-center gap-3 mt-1">
                    <Rating value={avgRating} readOnly />
                    <span className="text-sm" style={{ color: avgRatingColor }}>
                      {avgRating.toFixed(1)} / 5
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-white/60">
                  Reports
                </div>
                {loading ? (
                  <div className="mt-2 h-7 w-12 rounded bg-white/20 animate-pulse" />
                ) : (
                  <div className="text-lg font-semibold">{reportCount}</div>
                )}
              </div>
            </div>

            {/* Rating breakdown */}
            <div className="mt-4">
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-3 w-full rounded bg-white/10 overflow-hidden">
                      <div className="h-full w-1/2 bg-white/30 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingCounts[star - 1] || 0;
                    const pct = reportCount ? Math.round((count / reportCount) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <div className="w-8 text-xs text-white/70">{star}★</div>
                        <div className="flex-1 h-2 rounded bg-white/10 overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: getRatingColor(star) }}
                          />
                        </div>
                        <div className="w-14 text-right text-xs text-white/70">{pct}% ({count})</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {!loading && mostCommonRating && (
              <div className="mt-3 text-xs text-white/70">
                Most common rating: <span className="font-medium text-white">{mostCommonRating}★</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-white/10" />

          {/* Price summary */}
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-white/60">
                  Latest reported price
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {typeof marker?.price === 'number' ? `$${marker.price.toFixed(2)}` : '—'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-white/60">
                  Price range
                </div>
                <div className="mt-1 text-sm">
                  {priceStats ? (
                    <>
                      ${priceStats.min.toFixed(2)} – ${priceStats.max.toFixed(2)}
                    </>
                  ) : (
                    '—'
                  )}
                </div>
                <div className="text-xs text-white/60">
                  {priceStats ? `avg $${priceStats.avg.toFixed(2)}` : ''}
                </div>
              </div>
            </div>

            {/* Mini price trend */}
            <div className="mt-4 h-24 rounded-md bg-white/5 border border-white/10 flex items-end gap-1 p-2">
              {recentPrices ? (
                recentPrices.prices.map((p, i) => {
                  const { min, max } = recentPrices;
                  const range = Math.max(0.01, max - min);
                  const norm = (p - min) / range; // 0..1
                  const h = 16 + Math.round(norm * 56); // 16..72px
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-emerald-400/70 rounded-sm"
                      style={{ height: `${h}px` }}
                      title={`$${p.toFixed(2)}`}
                    />
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60 text-xs">
                  No price trend yet
                </div>
              )}
            </div>
          </div>

          {/* Recent comment */}
          {!loading && reportCount > 0 && (
            <div className="mt-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-xs uppercase tracking-wide text-white/60 mb-2">Latest report</div>
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm text-white/90">
                  {mostRecentReport?.comments ? (
                    <>
                      “{String(mostRecentReport.comments).slice(0, 160)}{String(mostRecentReport.comments).length > 160 ? '…' : ''}”
                    </>
                  ) : (
                    <span className="text-white/60">No comments</span>
                  )}
                </div>
                <div className="text-right text-xs text-white/60 whitespace-nowrap">
                  {timeAgo(toDate(mostRecentReport?.created_at) || null)}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-white/70">
                {typeof mostRecentReport?.rating === 'number' && (
                  <span className="inline-flex items-center gap-1">
                    <span>★</span>
                    {mostRecentReport.rating?.toFixed(1)}
                  </span>
                )}
                {typeof mostRecentReport?.price === 'number' && (
                  <span className="inline-flex items-center gap-1">
                    <span>💲</span>
                    ${mostRecentReport.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Empty state when no reports */}
          {!loading && reportCount === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium">No reports yet</div>
              <div className="text-xs text-white/60 mt-1">
                Be the first to add a rating and price for this coffee at this venue.
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="mt-4 text-xs text-white/60">
            {lastUpdated ? `Last updated ${timeAgo(lastUpdated)} • ${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}` : ''}
          </div>
        </div>

        {/* Sticky footer: Add report */}
        {marker?.venue_id != null && (
          <div className="sticky bottom-0 z-10 border-t border-white/15  backdrop-blur-lg px-4 py-3">
            <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold">Add a report</h2>
                <span className="text-xs text-white/60">
                  {`${selectedCoffeeType.coffeeType} • ${selectedCoffeeType.coffeeSize} • ${selectedCoffeeType.coffeeMilkType}`}
                </span>
              </div>
              <AddCoffeeReport
                venueId={marker.venue_id}
                selectedCoffeeType={selectedCoffeeType}
                onOpenChange={onOpenChange}
              />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MarkerDrawer;
