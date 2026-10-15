import { Navigation } from 'lucide-react';

export default function AddressMap({ address, label }: { address: string; label: string }) {
  const query = encodeURIComponent(address);
  const addressLine = address.replace(/,\s*United States$/, '');
  return <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${label}: ${address}`} className="flex min-h-12 items-center gap-3 rounded-2xl bg-surface-raised px-4 py-3 transition hover:bg-white active:scale-[.99]">
    <span className="min-w-0 flex-1"><span className="block text-[12px] text-text-soft">Address</span><span className="mt-0.5 line-clamp-2 block text-[13px] font-medium leading-5 text-ink">{addressLine}</span></span>
    <span className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-white px-3 text-[12px] font-medium text-brand-hover"><Navigation size={15}/>Directions</span>
  </a>;
}
