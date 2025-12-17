export interface ToggleItem {
  id: string;
  label: string;
}

export interface CustomRadioProps {
  item: ToggleItem;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ToggleButtonProps {
  items: ToggleItem[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
