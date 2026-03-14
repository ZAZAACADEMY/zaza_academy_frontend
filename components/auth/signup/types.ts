export interface Child {
  name: string;
  age: string;
  gender: string;
  avatar: number;
  program: string;
}

export type PaymentFrequency = "Monthly" | "Quarterly";
export type PaymentGateway = "Card" | "Mobile Money" | "PayPal";

export interface SignupState {
  step: number;
  // Step 1
  email: string; // Assuming we add this, it's weird if it's missing
  country: string;
  motivations: string[];
  // Step 2
  selectedPlan: string;
  // Step 3
  paymentFrequency: PaymentFrequency;
  // Step 4
  paymentGateway: PaymentGateway;
  // Step 5 Mobile
  mobileProvider: string;
  phoneNumber: string;
  // Step 5 Card
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  // Child Setup
  children: Child[];
  currentChild: Child;
}
