export type Option = {
  value: string;
  label: string;
  count: number;
};

export type Poll = {
  id: number;
  title: string;
  description: string;
  options: Option[];
};

export const POLLS_PATH = "polls";
