"use client";

import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import { memberById } from '../lib/data';

type ProfileCardProps = { memberId: string };

export default function ProfileCard({ memberId }: ProfileCardProps) {
  const member = memberById(memberId);
  if (!member) return null;

  return (
    <section className="rounded-[26px] bg-white/75 p-4">
      <div className="flex items-center gap-4">
        <Image src={`/photos/${member.photo}.jpg`} alt={`Photo of ${member.name}`} width={176} height={176} className="size-[88px] shrink-0 rounded-[25px] object-cover" />
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 text-[20px] font-medium tracking-[-.6px]">{member.name}<BadgeCheck size={19} className="shrink-0 fill-[#e8f3ff] text-[#1686e8]" aria-label="Verified member"/></h2>
          <p className="mt-1 text-[12px] text-[#827a72]">{member.occupation} · {member.location}</p>
          <p className="mt-2 text-[12px] text-[#81776d]">Blood group <strong className="font-medium text-[#5e554d]">{member.bloodGroup}</strong></p>
        </div>
      </div>
    </section>
  );
}
