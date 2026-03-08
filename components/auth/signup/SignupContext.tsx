"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
  motivations: string[];
  setMotivations: React.Dispatch<React.SetStateAction<string[]>>;

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
  const stepFromUrl = searchParams.get("step");
  const [isMounted, setIsMounted] = useState(false);

  // Core state with safe defaults for SSR
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [motivations, setMotivations] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("Family");
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>("Quarterly");
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

  // Sync from URL and localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedState = JSON.parse(saved);
      if (savedState.step && !stepFromUrl) setStep(savedState.step);
      if (savedState.firstName) setFirstName(savedState.firstName);
      if (savedState.lastName) setLastName(savedState.lastName);
      if (savedState.email) setEmail(savedState.email);
      if (savedState.country) setCountry(savedState.country);
      if (savedState.motivations) setMotivations(savedState.motivations);
      if (savedState.selectedPlan && !planFromUrl) setSelectedPlan(savedState.selectedPlan);
      if (savedState.paymentFrequency) setPaymentFrequency(savedState.paymentFrequency);
      if (savedState.paymentGateway) setPaymentGateway(savedState.paymentGateway);
      if (savedState.mobileProvider) setMobileProvider(savedState.mobileProvider);
      if (savedState.phoneNumber) setPhoneNumber(savedState.phoneNumber);
      if (savedState.cardHolder) setCardHolder(savedState.cardHolder);
      if (savedState.cardNumber) setCardNumber(savedState.cardNumber);
      if (savedState.expiryDate) setExpiryDate(savedState.expiryDate);
      if (savedState.cvv) setCvv(savedState.cvv);
      if (savedState.childrenList) setChildrenList(savedState.childrenList);
      if (savedState.currentChild) setCurrentChild(savedState.currentChild);
    }

    if (stepFromUrl) {
      const newStep = parseInt(stepFromUrl);
      if (!isNaN(newStep)) setStep(newStep);
    }
    if (planFromUrl) {
      setSelectedPlan(planFromUrl);
    }
  }, []); // Only on mount

  // Handle subsequent URL step changes
  useEffect(() => {
    if (isMounted && stepFromUrl) {
      const newStep = parseInt(stepFromUrl);
      if (!isNaN(newStep) && newStep !== step) {
        setStep(newStep);
      }
    }
  }, [stepFromUrl, isMounted]);

  // Save to localStorage on change
  useEffect(() => {
    if (!isMounted) return;
    const stateToSave = {
      step,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      country,
      motivations,
      selectedPlan,
      paymentFrequency,
      paymentGateway,
      mobileProvider,
      phoneNumber,
      cardHolder,
      cardNumber,
      expiryDate,
      cvv,
      childrenList,
      currentChild,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    step, firstName, lastName, email, password, confirmPassword,
    country, motivations, selectedPlan, paymentFrequency, paymentGateway,
    mobileProvider, phoneNumber, cardHolder, cardNumber, expiryDate,
    cvv, childrenList, currentChild, isMounted
  ]);

  const clearSignupData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(1);
    // Reset other fields as needed or just rely on the step reset
  };

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
        motivations,
        setMotivations,
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
        clearSignupData,
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
