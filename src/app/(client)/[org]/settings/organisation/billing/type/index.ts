export type HeaderProps = {
  title: string;
  nextBillingDate?: string;
  description: string;
  onComparePlan?: () => void;
};

export type PlanCardProps = {
  planName: string;
  description: string;
  price: number;
  currency: string;
  period: string;
  usersAdded: number;
  storageUsed: number;
  totalStorage: number;
  storageUnit: string;
};

export type FeatureListProps = {
  features: string[];
};

export type TopUpCreditsProps = {
  creditPrice: number;
  creditsPerDollar: number;
  creditOptions: any[];

  onPurchase?: (credits: number) => void;
};

export type AIUsageRecord = {
  id: string;
  agentName: string;
  agentType:
    | "error-handler"
    | "profanity-filter"
    | "content-moderator"
    | "translator"
    | "knowledge-base"
    | "analytics"
    | "scheduler";
  nameOwner: string;
  type: "Channel" | "Private Chat" | "Private Group";
  aiCredits: number;
  dateTime: string;
  status: "online" | "offline";
};

// Backend credit usage data structure
export type CreditUsageRecord = {
  id: string;
  organisation_id: string;
  amount: number;
  user_name: string;
  agent_name: string;
  created_at: string;
};

// Backend credit transactions data structure (same as usage for now)
export type CreditTransactionRecord = {
  id: string;
  organisation_id: string;
  amount: number;
  user_name: string;
  agent_name: string;
  created_at: string;
  type: string;
};

export type PricingTier = {
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  buttonText: string;
  isCurrentPlan?: boolean;
  isHighlighted?: boolean;
};

export type TelexTransaction = {
  id: string;
  description: string;
  extraDescription: string;
  servicePeriod?: string;
  date: string;
  type: string;
  amount: {
    base: number;
    vat: number;
    vatRate: number;
    total: number;
  };
  paymentMethod: {
    type:
      | "visa"
      | "mastercard"
      | "amex"
      | "paypal"
      | "bank_transfer"
      | "credit";
    lastFour: string;
    processor: "stripe" | "paypal" | "direct";
  };
  invoiceNumber?: string;
  status: "paid" | "pending" | "failed" | "refunded";
  currency: string;
  name: string;
  fee: number;
};
