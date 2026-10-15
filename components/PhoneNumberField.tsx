type PhoneNumberFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
};

export default function PhoneNumberField({ id, value, onChange, invalid = false, disabled = false }: PhoneNumberFieldProps) {
  return <input
    id={id}
    type="tel"
    autoComplete="tel-national"
    inputMode="tel"
    aria-invalid={invalid}
    value={value}
    onChange={event => onChange(event.target.value)}
    disabled={disabled}
    className={`h-[58px] min-w-0 flex-1 rounded-xl border bg-field px-4 text-[16px] outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${invalid ? 'border-red-500' : 'border-transparent'}`}
  />;
}
