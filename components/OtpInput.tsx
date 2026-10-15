"use client";

type OtpInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  invalid?: boolean;
};

export default function OtpInput({ value, onChange, invalid = false }: OtpInputProps) {
  function focusDigit(index: number) {
    document.getElementById(`otp-${index}`)?.focus();
  }

  return <div className="flex gap-3" role="group" aria-label="Four digit verification code">
    {Array.from({ length: 4 }, (_, index) => <input
      key={index}
      id={`otp-${index}`}
      aria-label={`Digit ${index + 1}`}
      aria-invalid={invalid}
      autoFocus={index === 0}
      autoComplete={index === 0 ? 'one-time-code' : 'off'}
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={1}
      value={value[index] ?? ''}
      onFocus={event => event.currentTarget.select()}
      onChange={event => {
        const digits = event.target.value.replace(/\D/g, '');
        if (digits.length > 1) {
          const pastedDigits = digits.slice(0, 4).split('');
          while (pastedDigits.length < 4) pastedDigits.push('');
          onChange(pastedDigits);
          focusDigit(Math.min(digits.length, 3));
          return;
        }
        const next = [...value];
        next[index] = digits;
        onChange(next);
        if (digits && index < 3) focusDigit(index + 1);
      }}
      onKeyDown={event => {
        if (event.key === 'Backspace' && !value[index] && index > 0) focusDigit(index - 1);
        if (event.key === 'ArrowLeft' && index > 0) focusDigit(index - 1);
        if (event.key === 'ArrowRight' && index < 3) focusDigit(index + 1);
      }}
      onPaste={event => {
        const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        if (!digits) return;
        event.preventDefault();
        const pastedDigits = digits.split('');
        while (pastedDigits.length < 4) pastedDigits.push('');
        onChange(pastedDigits);
        focusDigit(Math.min(digits.length, 3));
      }}
      className={`size-[58px] shrink-0 rounded-xl border bg-white text-center text-[22px] outline-none focus:border-border focus:ring-2 focus:ring-brand focus:ring-offset-2 ${invalid ? 'border-red-500' : 'border-border'}`}
    />)}
  </div>;
}
