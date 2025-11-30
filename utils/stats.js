import { getTransactionsForLastNDays } from "./transactions";

export const calculateWeeklySummary = (days = 7) => {
  const transactions = getTransactionsForLastNDays(days);

  let totalSpent = 0;
  let totalEarned = 0;

  transactions.forEach((t) => {
    const amount = t.amount;
    const type = t.type;

    if (type === "expense") {
      // Direct expenses reduce the total money
      totalSpent += amount;
    } else if (type === "income") {
      // Income increases the total money
      totalEarned += amount;
    }
  });

  return {
    spent: totalSpent,
    earned: totalEarned,
  };
};

export const formatCurrency = (value) => {
  const number = Number(value);

  if (isNaN(number)) return "0.00";

  // 'en-US' standardizes the comma for thousands and dot for decimals
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
