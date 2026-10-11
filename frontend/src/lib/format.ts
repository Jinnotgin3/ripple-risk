/** Format a number as Indian currency: ₹ 3,20,000.00 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format a plain number with tabular style hint (use with font-mono tabular-nums) */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

/** Format a percentage */
export function formatPct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}
