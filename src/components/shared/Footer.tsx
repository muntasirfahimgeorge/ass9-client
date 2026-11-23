
import Link from "next/link";
import {
  Wrench,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Sign In", href: "/signin" },
];

const popularCategories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
];

const socialLinks = [
  { label: "Facebook", symbol: "f", href: "https://www.facebook.com/" },
  { label: "Instagram", symbol: "ig", href: "https://www.instagram.com/" },
  { label: "LinkedIn", symbol: "in", href: "https://www.linkedin.com/" },
  { label: "X", symbol: "𝕏", href: "https://x.com/" },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#08090b] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c2f800] text-black">
                <Wrench size={22} />
              </span>
              <span className="text-2xl font-bold tracking-tight">
                Fix<span className="text-[#c2f800]">Mate</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-gray-400">
              Reliable repair services for your smart devices and home
              appliances. Book trusted technicians and get your devices fixed.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-gray-300 transition hover:border-[#c2f800] hover:bg-[#c2f800] hover:text-black"
                >
                  {social.symbol}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#c2f800]"
                  >
                    {link.label}
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold">Popular Categories</h3>
            <ul className="space-y-3">
              {popularCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="text-sm text-gray-400 transition hover:text-[#c2f800]"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Mail size={17} className="mt-0.5 shrink-0 text-[#c2f800]" />
                <span>support@fixmate.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Phone size={17} className="mt-0.5 shrink-0 text-[#c2f800]" />
                <span>+880 1XXXXXXXXX</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[#c2f800]" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FixMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
