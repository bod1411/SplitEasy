import { useState } from "react";
import { DollarSign, Plus } from "lucide-react";
import { type Friend, type InsertExpense, insertExpenseSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ExpenseSectionProps {
  friends: Friend[];
  onAddExpense: (expense: InsertExpense) => void;
}

export default function ExpenseSection({ friends, onAddExpense }: ExpenseSectionProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const { toast } = useToast();

  const handleAddExpense = () => {
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a description for the expense",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount",
      });
      return;
    }

    if (!paidBy) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select who paid for this expense",
      });
      return;
    }

    try {
      const expenseData = insertExpenseSchema.parse({
        description: description.trim(),
        amount: parseFloat(amount),
        paidBy,
      });

      onAddExpense(expenseData);
      
      // Reset form
      setDescription("");
      setAmount("");
      setPaidBy("");
      
      toast({
        title: "Success",
        description: "Expense has been added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add expense. Please check your input.",
      });
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-2xl font-semibold text-primary-text">
          <DollarSign className="text-money-green text-xl mr-3" />
          Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-primary-text mb-2">
            Description
          </Label>
          <Input
            type="text"
            placeholder="What was this expense for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-money-green focus:outline-none text-primary-text placeholder-secondary-text"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-primary-text mb-2">
            Amount ($)
          </Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-money-green focus:outline-none text-primary-text placeholder-secondary-text"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-primary-text mb-2">
            Who Paid?
          </Label>
          <Select value={paidBy} onValueChange={setPaidBy}>
            <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-money-green focus:outline-none text-primary-text bg-white">
              <SelectValue placeholder="Select who paid" />
            </SelectTrigger>
            <SelectContent>
              {friends.map((friend) => (
                <SelectItem key={friend.id} value={friend.name}>
                  {friend.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAddExpense}
          disabled={friends.length === 0}
          className="w-full bg-money-green hover:bg-money-green/90 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[48px]"
        >
          <Plus className="mr-2" size={20} />
          Add Expense
        </Button>

        {friends.length === 0 && (
          <p className="text-sm text-secondary-text text-center">
            Add friends first to create expenses
          </p>
        )}
      </CardContent>
    </Card>
  );
}
