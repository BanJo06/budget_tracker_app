import { getTransactionsForLastNDays } from "./transactions"; // Adjust path as needed

/**
 * Calculates the total spent and earned for a user over the last N days.
 * @param {number} days The number of days to analyze (e.g., 7).
 * @returns {{spent: number, earned: number}} An object with the total spent and earned.
 */
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
    } else if (type === "transfer") {
      // Transfers are a bit tricky, only count the 'from' account's outflow as 'spent' for the user's total cash flow picture
      // Assuming 't.account_id' is the 'fromAccountId' in your saveTransferTransaction
      // Since 'getTransactionsForLastNDays' fetches transactions and doesn't filter by a single account,
      // we need a mechanism to determine 'from' vs 'to' for a general summary.
      // For a global summary, 'transfer' is usually excluded or treated as an outflow from the source account.
      // Since your data structure doesn't easily distinguish 'from' based on the result for a global summary,
      // we'll assume for simplicity that all 'transfer' records in the database represent the outflow from the 'account_id'.
      // If the goal is a summary *for a specific account*, you'd need the account ID here.
      // For a *user's* weekly spending, we'll generally count transfers *out* (recorded in 'account_id') as money 'spent'.
      totalSpent += amount;
    }
    // Transfers are excluded from both spent/earned if you want a true income/expense view,
    // but often included in 'spent' to track money moving out of the main pool.
    // The current assumption is to count 'expense' and 'transfer' as 'spent'.
  });

  return {
    spent: totalSpent,
    earned: totalEarned,
  };
};

/**
 * Helper to format currency (assuming '₱' and 2 decimal places).
 * @param {number} amount
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (amount) => {
  return `₱${amount.toFixed(2)}`;
};
