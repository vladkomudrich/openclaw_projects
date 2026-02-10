"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "📊" },
  { href: "/history", label: "History", icon: "📅" },
  { href: "/learn", label: "Learn", icon: "📚" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  // Don't show on sleep entry pages
  if (pathname.startsWith("/sleep")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-area-inset-bottom md:hidden">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors
                ${isActive 
                  ? "text-primary" 
                  : "text-text-secondary hover:text-text-primary"
                }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function HeaderNavigation() {
  const pathname = usePathname();

  return (
    <header className="hidden md:block sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <span className="font-semibold text-text-primary">Frise</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors
                    ${isActive 
                      ? "text-primary font-medium" 
                      : "text-text-secondary hover:text-text-primary"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
