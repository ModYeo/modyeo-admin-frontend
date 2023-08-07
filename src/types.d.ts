export type RequiredInputItem = {
  itemName: string;
  name: string;
  refObject: React.RefObject<
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | { file: File | null }
  >;
  elementType: "input" | "textarea" | "image" | "select";
  defaultValue: string | number;
  isPrimary?: boolean;
  disabled?: boolean;
  options?: string[];
};
