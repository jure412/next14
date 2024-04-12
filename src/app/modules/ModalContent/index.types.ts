import { UseFormReturn } from "react-hook-form";

export interface FormProps {
  methods: UseFormReturn<Values>;
  onSubmit: (values: Values) => Promise<void>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
}

export interface Values {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email: string;
}

export interface AuthenticationProps {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setHeader?: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}
