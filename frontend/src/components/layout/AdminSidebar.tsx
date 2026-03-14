'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/products', label: '상품 관리', icon: '📦' },
  { href: '/admin/auctions', label: '경매 관리', icon: '🔨' },
  { href: '/admin/users', label: '고객 관리', icon: '👥' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#1A1A1A] text-white min-h-[calc(100vh-4rem)] p-4">
      <h2 className="text-lg font-bold mb-6 px-3">백오피스</h2>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
