"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideBarProps {
  userId: string;
}

export function SideBar({ userId }: SideBarProps) {
  const pathname = usePathname();

  return (
    <aside className="h-full bg-black px-6 py-5 fixed z-10">
      <nav className="h-full flex flex-col justify-between">
        <div>logo</div>

        <div className="flex flex-col gap-8">
          <div>test</div>
          <div>test</div>
          <div>test</div>
          <Link href={`/profile/${userId}`}>
            <User className="" />
          </Link>

          <div>test</div>
        </div>

        <div>aaaa</div>
      </nav>
    </aside>
  );
}
