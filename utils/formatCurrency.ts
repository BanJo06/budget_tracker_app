export function formatCurrency(value: string | number): string {
  if (value === null || value === undefined || value === "") return "0.00";

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "0.00";

  return num.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
