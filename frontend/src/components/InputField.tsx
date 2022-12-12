import React from "react";

interface Props {
  placeholder?: string;
  onChangeValue?: (value: any) => void;
}

interface TextFieldProps extends Props {
  type?: "text";
  value?: string;
}

interface NumberFieldProps extends Props {
  type?: "number";
  value?: number | "";
}

function InputField({
  type = "text",
  value,
  placeholder,
  onChangeValue,
}: TextFieldProps | NumberFieldProps) {
  return (
    <input
      className={`py-2 px-4 m-2  ${
        type === "number" ? "w-20 rounded-full" : "w-64 rounded-md"
      }`}
      type={type}
      value={value}
      placeholder={placeholder}
      min={type === "number" ? 0 : undefined}
      onChange={(e) => {
        const v: string | number =
          type === "number" ? parseInt(e.target.value) : e.target.value;
        onChangeValue?.(v);
      }}
    />
  );
}

export default InputField;
