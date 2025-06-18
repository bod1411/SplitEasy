import { Receipt, Trash2, X } from "lucide-react";
import { type Expense } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

interface ExpensesListProps {
  expenses: Expense[];
  onRemoveExpense: (expenseId: string) => void;
  onClearAll: () => void;
}

export default function ExpensesList({ expenses, onRemoveExpense, onClearAll }: ExpensesListProps) {
  const { toast } = useToast();

  const handleRemoveExpense = (expenseId: string) => {
    onRemoveExpense(expenseId);
    toast({
      title: "Success",
      description: "Expense has been removed",
    });
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all expenses? This action cannot be undone.")) {
      onClearAll();
      toast({
        title: "Success",
        description: "All expenses have been cleared",
      });
    }
  };

  if (expenses.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white rounded-xl shadow-lg mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-2xl font-semibold text-primary-text">
            <Receipt className="text-secondary-text text-xl mr-3" />
            Expenses
          </CardTitle>
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="text-red-500 hover:text-red-700 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
          >
            <Trash2 className="mr-2" size={16} />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="font-medium text-primary-text">{expense.description}</h3>
                <p className="text-secondary-text text-sm">
                  Paid by <span className="font-medium">{expense.paidBy}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-money-green">
                  {formatCurrency(expense.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveExpense(expense.id)}
                  className="text-red-500 hover:text-red-700 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-red-50"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
