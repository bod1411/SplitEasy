import { type Expense, type Friend, type Settlement, type Balance } from "@shared/schema";

export function calculateSettlement(expenses: Expense[], friends: Friend[]): {
  totalExpenses: number;
  perPersonAmount: number;
  balances: Balance[];
  settlements: Settlement[];
} {
  if (expenses.length === 0 || friends.length === 0) {
    return {
      totalExpenses: 0,
      perPersonAmount: 0,
      balances: [],
      settlements: [],
    };
  }

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate per person amount
  const perPersonAmount = totalExpenses / friends.length;

  // Calculate how much each person paid
  const paidAmounts = new Map<string, number>();
  friends.forEach(friend => paidAmounts.set(friend.name, 0));
  
  expenses.forEach(expense => {
    const currentAmount = paidAmounts.get(expense.paidBy) || 0;
    paidAmounts.set(expense.paidBy, currentAmount + expense.amount);
  });

  // Calculate balances (positive = should receive money, negative = owes money)
  const balances: Balance[] = friends.map(friend => {
    const paid = paidAmounts.get(friend.name) || 0;
    const balance = paid - perPersonAmount;
    return {
      name: friend.name,
      balance: Math.round(balance * 100) / 100, // Round to 2 decimal places
    };
  });

  // Calculate settlements using a greedy algorithm to minimize transfers
  const settlements: Settlement[] = [];
  const debtors = balances.filter(b => b.balance < 0).map(b => ({ ...b, balance: -b.balance }));
  const creditors = balances.filter(b => b.balance > 0);

  // Sort debtors and creditors by amount (descending)
  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  let i = 0; // debtors index
  let j = 0; // creditors index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(debtor.balance, creditor.balance);
    
    if (amount > 0.01) { // Only create settlement if amount is significant
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount * 100) / 100,
      });
    }

    debtor.balance -= amount;
    creditor.balance -= amount;

    if (debtor.balance < 0.01) i++;
    if (creditor.balance < 0.01) j++;
  }

  return {
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    perPersonAmount: Math.round(perPersonAmount * 100) / 100,
    balances,
    settlements,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
