"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Child, PaymentFrequency, PaymentGateway } from "./types";

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
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan");

  // Valid plan IDs that match Step2Plans
  const validPlans = ["Solo", "Family", "Family Plus"];
  const hasValidPlan = planFromUrl ? validPlans.includes(planFromUrl) : false;

  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");

  const [selectedPlan, setSelectedPlan] = useState(hasValidPlan ? planFromUrl! : "Family");
  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequency>("Quarterly");
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>("Card");

  const [mobileProvider, setMobileProvider] = useState("Vodacom");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [currentChild, setCurrentChild] = useState<Child>({
    name: "",
    age: "",
    gender: "",
    avatar: 0,
    program: "",
  });

  return (
    <SignupContext.Provider
      value={{
        step,
        setStep,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        country,
        setCountry,
        selectedPlan,
        setSelectedPlan,
        paymentFrequency,
        setPaymentFrequency,
        paymentGateway,
        setPaymentGateway,
        mobileProvider,
        setMobileProvider,
        phoneNumber,
        setPhoneNumber,
        cardHolder,
        setCardHolder,
        cardNumber,
        setCardNumber,
        expiryDate,
        setExpiryDate,
        cvv,
        setCvv,
        childrenList,
        setChildrenList,
        currentChild,
        setCurrentChild,
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
