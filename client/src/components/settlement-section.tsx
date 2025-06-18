import { useState } from "react";
import { Calculator, Users, ArrowRightLeft, CheckCircle, Share, Check, ChevronDown } from "lucide-react";
import { type Settlement, type Balance } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatCurrency } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

interface SettlementSectionProps {
  settlement: {
    totalExpenses: number;
    perPersonAmount: number;
    balances: Balance[];
    settlements: Settlement[];
  };
  onReset: () => void;
}

export default function SettlementSection({ settlement, onReset }: SettlementSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  const handleShare = async () => {
    const settlementText = `Split Easy Settlement Summary
    
Total Expenses: ${formatCurrency(settlement.totalExpenses)}
Per Person: ${formatCurrency(settlement.perPersonAmount)}

Settlement Instructions:
${settlement.settlements.map(s => 
  `• ${s.from} pays ${formatCurrency(s.amount)} to ${s.to}`
).join('\n')}

Generated with Split Easy`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Split Easy Settlement',
          text: settlementText,
        });
        toast({
          title: "Success",
          description: "Settlement shared successfully",
        });
      } catch (error) {
        // User cancelled or error occurred
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(settlementText);
        toast({
          title: "Success",
          description: "Settlement copied to clipboard",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy settlement details",
        });
      }
    }
  };

  const handleMarkAsSettled = () => {
    if (window.confirm("Are you sure you want to mark this as settled? This will reset the app for a new trip.")) {
      onReset();
      toast({
        title: "Success",
        description: "Trip settled! Ready for your next adventure.",
      });
    }
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white rounded-xl shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="bg-total-blue bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="text-total-blue text-2xl" />
            </div>
            <h3 className="text-sm font-medium text-secondary-text mb-1">Total Expenses</h3>
            <p className="text-3xl font-bold text-total-blue">
              {formatCurrency(settlement.totalExpenses)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="bg-money-green bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-money-green text-2xl" />
            </div>
            <h3 className="text-sm font-medium text-secondary-text mb-1">Per Person</h3>
            <p className="text-3xl font-bold text-money-green">
              {formatCurrency(settlement.perPersonAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="bg-settlement-purple bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightLeft className="text-settlement-purple text-2xl" />
            </div>
            <h3 className="text-sm font-medium text-secondary-text mb-1">Settlements</h3>
            <p className="text-3xl font-bold text-settlement-purple">
              {settlement.settlements.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settlement Details */}
      <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center">
                <CheckCircle className="text-settlement-purple text-xl mr-3" />
                <h2 className="text-2xl font-semibold text-primary-text">Settlement Details</h2>
              </div>
              <ChevronDown
                className={`text-secondary-text transform transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-6 pb-6 border-t border-gray-100">
              {settlement.balances.length === 0 ? (
                <div className="text-center py-8 text-secondary-text">
                  <CheckCircle className="mx-auto mb-2" size={48} />
                  <p>No expenses to settle</p>
                  <p className="text-sm">Add some expenses to see settlement details</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Individual Balances */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-text mb-4">
                        Individual Balances
                      </h3>
                      <div className="space-y-3">
                        {settlement.balances.map((balance) => (
                          <div
                            key={balance.name}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium text-primary-text">
                              {balance.name}
                            </span>
                            <span
                              className={`font-bold ${
                                balance.balance >= 0
                                  ? 'text-money-green'
                                  : 'text-red-500'
                              }`}
                            >
                              {balance.balance >= 0 ? '+' : ''}
                              {formatCurrency(balance.balance)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Settlement Instructions */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-text mb-4">
                        Settlement Instructions
                      </h3>
                      <div className="space-y-3">
                        {settlement.settlements.length === 0 ? (
                          <div className="p-4 border-l-4 border-money-green bg-green-50 rounded-r-lg">
                            <p className="text-primary-text">
                              🎉 All settled! No transfers needed.
                            </p>
                          </div>
                        ) : (
                          settlement.settlements.map((settlement, index) => (
                            <div
                              key={index}
                              className="p-4 border-l-4 border-settlement-purple bg-purple-50 rounded-r-lg"
                            >
                              <p className="text-primary-text">
                                <span className="font-medium">{settlement.from}</span> pays{' '}
                                <span className="font-bold text-settlement-purple">
                                  {formatCurrency(settlement.amount)}
                                </span>{' '}
                                to <span className="font-medium">{settlement.to}</span>
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleShare}
                      className="flex-1 bg-settlement-purple hover:bg-settlement-purple/90 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[48px]"
                    >
                      <Share className="mr-2" size={20} />
                      Share Settlement
                    </Button>
                    <Button
                      onClick={handleMarkAsSettled}
                      className="flex-1 bg-money-green hover:bg-money-green/90 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[48px]"
                    >
                      <Check className="mr-2" size={20} />
                      Mark as Settled
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </>
  );
}
