import { PiggyBank, Sparkles } from "lucide-react";

const EmptyTransactionsPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="relative">
        <PiggyBank className="w-16 h-16 text-purple-400" />
        <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-700">No expenses yet!</p>
        <p className="text-sm text-gray-500">
          Your piggy bank is feeling lonely...
        </p>
      </div>
    </div>
  );
};

export default EmptyTransactionsPlaceholder;
