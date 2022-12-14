import { CheckIcon } from "@heroicons/react/20/solid";

export default function CheckboxField({
  name,
  label,
  checked,
  value,
  onChange,
}: {
  name: string;
  label: string;
  checked?: boolean;
  value?: string;
  onChange?: () => void;
}) {
  return (
    <label className="field field-checkbox">
      <input
        name={name}
        type="checkbox"
        defaultChecked={checked}
        onChange={onChange}
        value={value}
      />
      <div className="checkbox">
        <CheckIcon />
      </div>
      <span className="field-label">{label}</span>
    </label>
  );
}
