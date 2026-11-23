
import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Clock3,
  Users,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Technicians",
    description:
      "Find skilled technicians who can help repair your smart devices and home appliances.",
  },
  {
    icon: Clock3,
    title: "Convenient Booking",
    description:
      "Browse available services and book a repair according to your needs.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description:
      "We aim to make the repair booking process simple, transparent, and convenient.",
  },
];

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <section className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c2f800] text-black">
            <Wrench size={32} />
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#c2f800]">
            About FixMate
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Repair Made
            <span className="text-[#c2f800]"> Simple.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            FixMate is a repair service platform designed to connect customers
            with technicians for smart device and home appliance repairs. Our
            goal is to make finding and booking repair services easier.
          </p>

          <Link
            href="/services"
            className="mt-9 inline-flex items-center gap-2 rounded-lg bg-[#c2f800] px-6 py-3 font-semibold text-black transition hover:bg-[#a9d900]"
          >
            Explore Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#c2f800]">
            Why FixMate
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            A Better Way to Get Things Fixed
          </h2>

          <p className="mt-4 leading-7 text-gray-400">
            We bring customers and repair professionals together through one
            convenient platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-[#15171d] p-7 transition hover:border-[#c2f800]/50"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#c2f800]/10 text-[#c2f800]">
                  <Icon size={25} />
                </div>

                <h3 className="mb-3 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="leading-7 text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#15171d] px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-bold">
            Need a Repair Service?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
            Explore available repair services and find the right service for
            your device or home appliance.
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#c2f800] px-6 py-3 font-semibold text-black transition hover:bg-[#a9d900]"
          >
            Browse Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
