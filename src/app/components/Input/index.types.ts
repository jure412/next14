// extend InputProps and add Input default props

// export type InputProps = {
//   name: string;
//   label?: string;
//   type?: string;
//   validation?: any;
//   placeholder?: string;
//   min?: number;
//   max?: number;
// };

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validation?: any;
}
