export enum Size {
  SMALL = "small",
  MEDIUM = "medium",
}

export type InputToggleProps = {
  size?: Size;
  label: string;
  name: string;
  validation?: any;
};
