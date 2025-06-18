import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { type Friend, type Expense, type InsertFriend, type InsertExpense } from "@shared/schema";
import { calculateSettlement } from "@/lib/calculations";
import FriendsSection from "@/components/friends-section";
import ExpenseSection from "@/components/expense-section";
import ExpensesList from "@/components/expenses-list";
import SettlementSection from "@/components/settlement-section";

export default function Home() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: nanoid(), name: "You" }
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFriends = localStorage.getItem('split-easy-friends');
    const savedExpenses = localStorage.getItem('split-easy-expenses');
    
    if (savedFriends) {
      try {
        const parsedFriends = JSON.parse(savedFriends);
        if (parsedFriends.length > 0) {
          setFriends(parsedFriends);
        }
      } catch (error) {
        console.error('Error loading friends from localStorage:', error);
      }
    }
    
    if (savedExpenses) {
      try {
        const parsedExpenses = JSON.parse(savedExpenses);
        setExpenses(parsedExpenses.map((expense: any) => ({
          ...expense,
          createdAt: new Date(expense.createdAt)
        })));
      } catch (error) {
        console.error('Error loading expenses from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('split-easy-friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('split-easy-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addFriend = (friendData: InsertFriend) => {
    // Check for duplicate names
    const isDuplicate = friends.some(friend => 
      friend.name.toLowerCase() === friendData.name.toLowerCase()
    );
    
    if (isDuplicate) {
      throw new Error("Friend with this name already exists");
    }

    const newFriend: Friend = {
      id: nanoid(),
      ...friendData,
    };
    setFriends(prev => [...prev, newFriend]);
  };

  const removeFriend = (friendId: string) => {
    // Don't allow removing "You"
    const friend = friends.find(f => f.id === friendId);
    if (friend?.name === "You") {
      throw new Error("Cannot remove yourself from the group");
    }

    setFriends(prev => prev.filter(f => f.id !== friendId));
    
    // Remove expenses paid by this friend
    setExpenses(prev => prev.filter(expense => {
      const friendName = friends.find(f => f.id === friendId)?.name;
      return expense.paidBy !== friendName;
    }));
  };

  const addExpense = (expenseData: InsertExpense) => {
    const newExpense: Expense = {
      id: nanoid(),
      ...expenseData,
      createdAt: new Date(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const removeExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  const clearAllExpenses = () => {
    setExpenses([]);
  };

  const resetApp = () => {
    setFriends([{ id: nanoid(), name: "You" }]);
    setExpenses([]);
    localStorage.removeItem('split-easy-friends');
    localStorage.removeItem('split-easy-expenses');
  };

  const settlement = calculateSettlement(expenses, friends);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-text mb-2">Split Easy</h1>
        <p className="text-secondary-text text-lg">Share expenses with friends effortlessly</p>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FriendsSection 
          friends={friends}
          onAddFriend={addFriend}
          onRemoveFriend={removeFriend}
        />
        <ExpenseSection 
          friends={friends}
          onAddExpense={addExpense}
        />
      </div>

      {/* Expenses List */}
      {expenses.length > 0 && (
        <ExpensesList 
          expenses={expenses}
          onRemoveExpense={removeExpense}
          onClearAll={clearAllExpenses}
        />
      )}

      {/* Settlement Section */}
      <SettlementSection 
        settlement={settlement}
        onReset={resetApp}
      />

      {/* Footer */}
      <footer className="text-center mt-12 py-6">
        <p className="text-secondary-text text-sm">
          © 2024 Split Easy. Perfect for trips, dinners, and group activities.
        </p>
      </footer>
    </div>
  );
}
