export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: "subscriber" | "admin";
  subscription_status: "active" | "inactive" | "cancelled" | "lapsed";
  subscription_plan: "monthly" | "yearly" | null;
  subscription_renewal_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  charity_id: string | null;
  charity_contribution_percent: number;
  created_at: string;
};

export type Charity = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  website_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  total_raised: number;
  created_at: string;
};

export type GolfScore = {
  id: string;
  user_id: string;
  score: number;
  score_date: string;
  created_at: string;
};

export type Draw = {
  id: string;
  draw_month: number;
  draw_year: number;
  status: "pending" | "simulated" | "published";
  draw_type: "random" | "algorithmic";
  winning_numbers: number[];
  jackpot_amount: number;
  pool_4match: number;
  pool_3match: number;
  rolled_over_jackpot: number;
  total_subscribers: number;
  published_at: string | null;
  created_at: string;
};

export type DrawEntry = {
  id: string;
  draw_id: string;
  user_id: string;
  numbers_entered: number[];
  match_count: number;
  prize_tier: "5-match" | "4-match" | "3-match" | null;
  prize_amount: number | null;
  created_at: string;
};

export type Winner = {
  id: string;
  draw_id: string;
  user_id: string;
  prize_tier: string;
  prize_amount: number;
  verification_status: "pending" | "approved" | "rejected";
  proof_url: string | null;
  payment_status: "pending" | "paid";
  submitted_at: string | null;
  reviewed_at: string | null;
  paid_at: string | null;
};
