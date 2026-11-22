import Link from "next/link";
import { ArrowRight, Home, Info, Wrench } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/about", label: "About Us", icon: Info },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-[66px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <ul className="flex items-center gap-4 sm:gap-9">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-2 py-3 text-sm font-semibold text-slate-600 transition-colors hover:text-[#14243A] sm:text-[15px]"
              >
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/services"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#B8F34A] px-3 py-2.5 text-xs font-bold text-[#14243A] transition-all hover:bg-[#a5df36] sm:px-5 sm:text-sm"
        >
          Find a Technician
          <ArrowRight size={16} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;