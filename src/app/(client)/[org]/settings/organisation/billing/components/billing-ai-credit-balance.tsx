import React, { useState, useEffect } from "react";
import StorageIndicator from "~/app/(client)/[org]/_components/storage/storage-indicator";
import Icons from "~/app/(client)/[org]/_components/billing/icons";
import { CircleHelp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const BilllingAICreditBalance = ({
  creditUsed,
  creditUnit,
  totalCredit,
}: {
  totalCredit: number;
  creditUsed: number;
  creditUnit: string;
}) => {
  const [currentCreditUsed, setCurrentCreditUsed] = useState(creditUsed);
  const [currentTotalCredit, setCurrentTotalCredit] = useState(totalCredit);

  // Update local state when props change
  useEffect(() => {
    setCurrentCreditUsed(creditUsed);
  }, [creditUsed]);

  useEffect(() => {
    setCurrentTotalCredit(totalCredit);
  }, [totalCredit]);

  // Listen for credit updates to trigger re-renders
  useEffect(() => {
    const handleCreditBalanceUpdate = (event: CustomEvent) => {
      const { creditBalance } = event.detail;
      if (creditBalance !== undefined) {
        setCurrentTotalCredit(creditBalance);
      }
    };

    const handleCreditUsageUpdate = (event: CustomEvent) => {
      const { creditUsage } = event.detail;
      if (creditUsage && Array.isArray(creditUsage)) {
        // Calculate today's usage from the updated credit usage data
        const today = new Date();
        const todayStr = today.toDateString();

        const todaysUsage = creditUsage.reduce((total: number, record: any) => {
          const recordDate = new Date(record.created_at);
          if (recordDate.toDateString() === todayStr) {
            return total + record.amount;
          }
          return total;
        }, 0);

        setCurrentCreditUsed(todaysUsage);
      }
    };

    window.addEventListener(
      "creditBalanceUpdated",
      // eslint-disable-next-line
      handleCreditBalanceUpdate as EventListener
    );
    window.addEventListener(
      "creditUsageUpdated",
      // eslint-disable-next-line
      handleCreditUsageUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "creditBalanceUpdated",
        // eslint-disable-next-line
        handleCreditBalanceUpdate as EventListener
      );
      window.removeEventListener(
        "creditUsageUpdated",
        // eslint-disable-next-line
        handleCreditUsageUpdate as EventListener
      );
    };
  }, []);

  // credit_balance from the API is already net of usage, so the remaining
  // balance plus today's usage is the balance the org started the day with.
  const startOfDayBalance = currentTotalCredit + currentCreditUsed;
  const creditPercentage =
    startOfDayBalance > 0
      ? Math.min((currentCreditUsed / startOfDayBalance) * 100, 100)
      : 0;

  return (
    <div className="bg-white border rounded-xl h-full overflow-hidden ">
      <div className="space-y-4 ">
        <div className="bg-[#F9FAFB] p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer">
              <Icons name="money" svgProps={{}} />
              <p className="text-[#667085]">Balance</p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-white p-1 rounded-full border cursor-pointer">
                  <CircleHelp size={16} color="#667085" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 relative -mr-[2px] -mt-[80px]"
                side="top"
                align="end"
              >
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    AI Credits are shared by your org and are consumed whenever
                    agents perform tasks.
                  </p>
                </div>
                <div className="absolute bottom-0 -right-[0px] transform -translate-x-1/2 translate-y-[70%] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-popover"></div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-full mt-4">
            <div className="flex items-center gap-2 text-[#475467]">
              <p
                className={`font-medium text-2xl ${
                  currentTotalCredit < 0 ? "text-red-500" : ""
                }`}
              >
                {" "}
                {new Intl.NumberFormat("en-US").format(
                  Math.max(currentTotalCredit, 0)
                )}
              </p>
              <span className="text-sm">AI Credits</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 ">
          <StorageIndicator storagePercentage={creditPercentage} />

          <p className="text-sm text-gray-900 mt-2">
            {new Intl.NumberFormat("en-US").format(currentCreditUsed)}{" "}
            {creditUnit} <span className="text-gray-500">Used Today</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BilllingAICreditBalance;
