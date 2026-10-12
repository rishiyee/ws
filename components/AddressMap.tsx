import { Navigation } from 'lucide-react';

export default function AddressMap({ address, label }: { address: string; label: string }) {
  const query = encodeURIComponent(address);
  return <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${label} in Maps: ${address}`} className="flex min-h-12 items-center gap-3 rounded-2xl bg-[#f8f5f1] p-2 pr-3 transition hover:bg-white active:scale-[.99]">
    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#e8e1d9]" aria-hidden="true">
      <iframe title={`Map of ${label}`} src={`https://maps.google.com/maps?q=${query}&z=14&output=embed`} loading="lazy" tabIndex={-1} referrerPolicy="no-referrer-when-downgrade" className="pointer-events-none absolute left-1/2 top-1/2 size-[260px] max-w-none -translate-x-1/2 -translate-y-1/2 border-0"/>
    </span>
    <span className="min-w-0 flex-1"><span className="block text-[10px] text-[#999087]">Address</span><span className="mt-0.5 line-clamp-2 block text-[11px] font-medium leading-4 text-[#25211e]">{address}</span></span>
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#e64d08]"><Navigation size={15}/></span>
  </a>;
}
