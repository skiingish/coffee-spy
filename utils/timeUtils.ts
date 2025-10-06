export const toDate = (d: Date | string | number | null | undefined): Date | null => {
    if (!d) return null;
    const n = new Date(d);
    return isNaN(n.getTime()) ? null : n;
  };
export const timeAgo = (date: Date | null): string => {
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