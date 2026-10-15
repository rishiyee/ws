"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type CountryCode = { code: string; name: string; dialCode: string };

type CountryCodeDropdownProps = {
  countries: CountryCode[];
  value: string;
  onChange: (countryCode: string) => void;
};

export default function CountryCodeDropdown({ countries, value, onChange }: CountryCodeDropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedCountry = countries.find(country => country.code === value) ?? countries[0];
  if (!selectedCountry) return null;

  return (
    <div className="relative shrink-0" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }} onKeyDown={event => {
      if (event.key === 'Escape') setOpen(false);
    }}>
      <button
        type="button"
        aria-label={`Country calling code, ${selectedCountry.name} ${selectedCountry.dialCode}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
        className="flex h-[58px] w-[112px] items-center justify-between rounded-xl bg-field px-3 text-[16px] outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
      >
        <span>{selectedCountry.code} {selectedCountry.dialCode}</span>
        <ChevronDown aria-hidden="true" size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}/>
      </button>
      {open && <div role="listbox" aria-label="Select country" className="absolute left-0 top-[64px] z-30 max-h-60 w-[248px] overflow-y-auto rounded-2xl border border-border-soft bg-white p-1.5 shadow-xl">
        {countries.map(country => <button
          key={country.code}
          type="button"
          role="option"
          aria-selected={country.code === value}
          onClick={() => { onChange(country.code); setOpen(false); }}
          className={`flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-[16px] hover:bg-paper focus:bg-paper focus:outline-none ${country.code === value ? 'bg-paper font-medium' : ''}`}
        ><span>{country.name}</span><span className="text-text-muted">{country.dialCode}</span></button>)}
      </div>}
    </div>
  );
}
