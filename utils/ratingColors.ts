export const getRatingColor = (rating: number | null): string => {
    if (!rating) return '#6b7280'; // Default gray

    const normalizedRating = Math.max(0, Math.min(5, rating));

    if (normalizedRating < 1) return '#ef4444';    // red-500
    if (normalizedRating < 1.5) return '#fb923c';  // orange-400
    if (normalizedRating < 2) return '#fbbf24';    // amber-400
    if (normalizedRating < 2.5) return '#facc15';  // yellow-400
    if (normalizedRating < 3) return '#a3e635';    // lime-400
    if (normalizedRating < 3.5) return '#4ade80';  // green-400
    if (normalizedRating < 4) return '#10b981';    // emerald-500
    if (normalizedRating < 4.5) return '#0d9488';  // teal-600
    return '#7c3aed';                              // violet-600
};
