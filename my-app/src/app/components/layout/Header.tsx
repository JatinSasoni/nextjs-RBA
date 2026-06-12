"use client";

import { User } from "@/app/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const pathName = usePathname();
  const navigation = [
    { name: "Home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);

  const getNavItemClass = (href: string) => {
    let isActive = false;
    if (href == "/") {
      isActive = pathName === "/";
    } else if (href === "/dashboard") {
      isActive = pathName.startsWith(href);
    }
    return `px-3 py-2 rounded text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover-bg-slate-800 hover:text-white"
    }`;
  };
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/*Logo */}
          <Link href="/" className="font-bold text-xl text-white">
            TMS
          </Link>
          {/* Navigation */}
          <nav>
            {navigation.map((nav) => (
              <Link
                key={nav.name}
                href={nav.href}
                className={getNavItemClass(nav.href)}
              >
                {nav.name}
              </Link>
            ))}
          </nav>
          {/* User info  */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-slate-300">Dipesh User</span>
                <button
                  // onClick={}
                  className="bg-red-500 px-3 py-2 text-white rounded-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white border-slate-400 border-2 px-3 py-1 rounded-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-3 py-1 rounded-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
