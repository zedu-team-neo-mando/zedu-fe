export type MembersColumn = {
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
};

export type Member = {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  avatar_url: string;
  default_avatar_url: string;
  name: string;
  role: string;
  status:
    | "active"
    | "inactive"
    | "invited"
    | "pending"
    | "deactivated"
    | "accepted";
  created_at: string;
  entity_type: "bot" | "user";
  is_deactivated?: boolean;
  is_restricted?: boolean;
};

export type MembersProps = {
  membersData?: Member[];
  isLoading?: boolean;
};

export type InvitesProps = {
  invitesData?: Member[];
  isLoading?: boolean;
};
