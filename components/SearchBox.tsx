"use client";

import { Search, X } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

type SearchBoxProps = {
  value?: string;
  setValue?: (value: string) => void;
  compact?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
};

export default function SearchBox({ value, setValue, compact = false, autoFocus = false, placeholder = 'Search families, people, events…' }: SearchBoxProps) {
  const [localValue, setLocalValue] = useState('');
  const query = value ?? localValue;
  const update = setValue ?? setLocalValue;

  return (
    <label className={`flex h-[50px] items-center gap-3 rounded-2xl border border-[#e7e0d8] bg-white/80 px-4 focus-within:border-[#d2bca9] ${compact ? '' : 'w-full'}`}>
      <Search size={18} className="shrink-0 text-[#8e8780]" />
      <input
        className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#a49c94]"
        type="search"
        enterKeyHint="search"
        autoFocus={autoFocus}
        value={query}
        onChange={event => update(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder.replace(/…$/, '')}
      />
      {query && (
        <Button
          type="button"
          className="grid size-9 place-items-center rounded-full text-[#817c76]"
          aria-label="Clear search"
          onClick={() => update('')}
        >
          <X size={17} />
        </Button>
      )}
    </label>
  );
}
