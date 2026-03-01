"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Child, PaymentFrequency, PaymentGateway } from "./types";

const STORAGE_KEY = "zaza_signup_state";

interface SignupContextType {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;

  // Step 1: Account
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;

  // Step 2: Plans
  selectedPlan: string;
  setSelectedPlan: React.Dispatch<React.SetStateAction<string>>;

  // Step 3: Frequency
  paymentFrequency: PaymentFrequency;
  setPaymentFrequency: React.Dispatch<React.SetStateAction<PaymentFrequency>>;

  // Step 4: Gateway
  paymentGateway: PaymentGateway;
  setPaymentGateway: React.Dispatch<React.SetStateAction<PaymentGateway>>;

  // Step 5: Details
  mobileProvider: string;
  setMobileProvider: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;

  cardHolder: string;
  setCardHolder: React.Dispatch<React.SetStateAction<string>>;
  cardNumber: string;
  setCardNumber: React.Dispatch<React.SetStateAction<string>>;
  expiryDate: string;
  setExpiryDate: React.Dispatch<React.SetStateAction<string>>;
  cvv: string;
  setCvv: React.Dispatch<React.SetStateAction<string>>;

  // Step 8: Children
  childrenList: Child[];
  setChildrenList: React.Dispatch<React.SetStateAction<Child[]>>;
  currentChild: Child;
  setCurrentChild: React.Dispatch<React.SetStateAction<Child>>;

  clearSignupData: () => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan");

  // Initial state helper
  const getInitialState = () => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  };

  const savedState = getInitialState();

  const [step, setStep] = useState(savedState?.step || 1);
  const [firstName, setFirstName] = useState(savedState?.firstName || "");
  const [lastName, setLastName] = useState(savedState?.lastName || "");
  const [email, setEmail] = useState(savedState?.email || "");
  const [password, setPassword] = useState(savedState?.password || "");
  const [confirmPassword, setConfirmPassword] = useState(savedState?.confirmPassword || "");
  const [country, setCountry] = useState(savedState?.country || "");

  const [selectedPlan, setSelectedPlan] = useState(planFromUrl || savedState?.selectedPlan || "Family");
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>(savedState?.paymentFrequency || "Quarterly");
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>(savedState?.paymentGateway || "Card");

  const [mobileProvider, setMobileProvider] = useState(savedState?.mobileProvider || "Vodacom");
  const [phoneNumber, setPhoneNumber] = useState(savedState?.phoneNumber || "");

  const [cardHolder, setCardHolder] = useState(savedState?.cardHolder || "");
  const [cardNumber, setCardNumber] = useState(savedState?.cardNumber || "");
  const [expiryDate, setExpiryDate] = useState(savedState?.expiryDate || "");
  const [cvv, setCvv] = useState(savedState?.cvv || "");

  const [childrenList, setChildrenList] = useState<Child[]>(savedState?.childrenList || []);
  const [currentChild, setCurrentChild] = useState<Child>(savedState?.currentChild || {
    name: "",
    age: "",
    gender: "",
    avatar: 0,
    program: "",
  });

  // Save to localStorage on change
  useEffect(() => {
    const stateToSave = {
      step, firstName, lastName, email, password, confirmPassword, country,
      selectedPlan, paymentFrequency, paymentGateway, mobileProvider, phoneNumber,
      cardHolder, cardNumber, expiryDate, cvv, childrenList, currentChild
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    step, firstName, lastName, email, password, confirmPassword, country,
    selectedPlan, paymentFrequency, paymentGateway, mobileProvider, phoneNumber,
    cardHolder, cardNumber, expiryDate, cvv, childrenList, currentChild
  ]);

  const clearSignupData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(1);
    // Reset other fields as needed or just rely on the step reset
  };

  return (
    <SignupContext.Provider
      value={{
        step, setStep, firstName, setFirstName, lastName, setLastName, email, setEmail,
        password, setPassword, confirmPassword, setConfirmPassword, country, setCountry,
        selectedPlan, setSelectedPlan, paymentFrequency, setPaymentFrequency,
        paymentGateway, setPaymentGateway, mobileProvider, setMobileProvider,
        phoneNumber, setPhoneNumber, cardHolder, setCardHolder, cardNumber, setCardNumber,
        expiryDate, setExpiryDate, cvv, setCvv, childrenList, setChildrenList,
        currentChild, setCurrentChild, clearSignupData
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};
