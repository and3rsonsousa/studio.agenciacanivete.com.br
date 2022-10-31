import React from "react";

export default function Field({
  title,
  name,
  type,
  placeholder,
  value,
  onChange,
}: {
  title: string;
  name: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="field">
      <span className="field-label">{title}</span>
      <input
        type={type ?? "text"}
        className="field-input"
        placeholder={placeholder ?? title}
        name={name}
        defaultValue={value}
        onChange={onChange}
        // pattern="[A-Za-z]*"
      />
    </label>
  );
}
