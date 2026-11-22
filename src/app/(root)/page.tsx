
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Smartphone,
  Laptop,
  Wind,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  Wrench,
} from "lucide-react";

import ServiceCard from "@/components/services/ServiceCard";
import { getServices } from "@/lib/api/services";
import type { TService, TServiceCategory } from "@/types";

const categories: {
  name: TServiceCategory;
  icon: React.ElementType;
}[] = [
  { name: "Smartphone", icon: Smartphone },
  { name: "Laptop & PC", icon: Laptop },
  { name: "AC", icon: Wind },
  { name: "Refrigerator", icon: Refrigerator },
  { name: "TV", icon: Tv },
  { name: "Washing Machine", icon: WashingMachine },
  { name: "Electrical", icon: Zap },
];

const steps = [
  {
    number: "01",
    title: "Find a Service",
    description: "Browse available repair services and choose the one you need.",
  },
  {
    number: "02",
    title: "Book a Technician",
    description: "Select a convenient date and submit your repair request.",
  },
  {
    number: "03",
    title: "Get Your Device Repaired",
    description: "Our assigned technician will handle your repair request.",
  },
  {
    number: "04",
    title: "Pay Securely",
    description: "Complete your payment securely after the repair is finished.",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Technicians",
    description: "Find repair services provided by registered technicians.",
  },
  {
    icon: Clock3,
    title: "Convenient Booking",
    description: "Choose your preferred repair date and service mode.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent Pricing",
    description: "See the service price before submitting your booking.",
  },
];

export default async function HomePage() {
  let services: TService[] = [];
  let serviceError = false;

  try {
    services = await getServices("sort=newest");
  } catch {
    serviceError = true;
  }

  const featuredServices = services.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#14243A] px-5 py-20 text-white sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B8F34A]/30 bg-[#B8F34A]/10 px-4 py-2 text-sm font-semibold text-[#B8F34A]">
              <Wrench size={16} />
              SMART REPAIR. TRUSTED CARE.
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Your Trusted Partner for
              <span className="text-[#B8F34A]"> Every Repair.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              From smartphones and laptops to home appliances, find skilled
              technicians and book reliable repair services with FixMate.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#B8F34A] px-6 font-bold text-[#14243A] transition hover:bg-[#a5df36]"
              >
                Explore Services
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/signup"
                className="inline-flex h-12 items-center rounded-lg border border-slate-500 px-6 font-semibold text-white transition hover:border-[#B8F34A] hover:text-[#B8F34A]"
              >
                Join FixMate
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="text-[#B8F34A]" size={17} />
                Verified service listings
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="text-[#B8F34A]" size={17} />
                Secure online payment
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute size-72 rounded-full bg-[#B8F34A]/10 blur-3xl sm:size-96" />

            <div className="relative w-full max-w-md rounded-3xl border border-slate-600 bg-[#1B304B] p-8 shadow-2xl">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#B8F34A] text-[#14243A]">
                <Wrench size={34} />
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                Repair Made Simple
              </h2>

              <p className="mt-3 leading-7 text-slate-300">
                One platform to discover repair services, connect with
                technicians, track bookings, and complete payments.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Browse available services",
                  "Book your preferred technician",
                  "Track your repair progress",
                  "Pay after successful completion",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="shrink-0 text-[#B8F34A]" size={19} />
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-[#729D20]">
            WHAT DO YOU NEED?
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#14243A]">
            Browse Repair Categories
          </h2>
          <p className="mt-3 text-slate-500">
            Find the right repair service for your device or appliance.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              href={`/services?category=${encodeURIComponent(name)}`}
              className="group flex min-h-36 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-[#B8F34A] hover:shadow-lg"
            >
              <span className="flex size-14 items-center justify-center rounded-xl bg-[#B8F34A]/20 text-[#14243A] transition group-hover:bg-[#B8F34A]">
                <Icon size={27} />
              </span>
              <span className="font-bold text-[#14243A]">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold tracking-widest text-[#729D20]">
                EXPLORE FIXMATE
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#14243A]">
                Featured Repair Services
              </h2>
              <p className="mt-3 text-slate-500">
                Explore the latest approved and available repair services.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-bold text-[#14243A] transition hover:text-[#729D20]"
            >
              View All Services
              <ArrowRight size={18} />
            </Link>
          </div>

          {serviceError ? (
            <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <h3 className="font-bold text-red-800">
                Unable to Load Services
              </h3>
              <p className="mt-2 text-sm text-red-700">
                Please make sure the FixMate server is running and try again.
              </p>
            </div>
          ) : featuredServices.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-[#F7F9FC] px-5 py-16 text-center">
              <Wrench className="mx-auto text-slate-400" size={42} />
              <h3 className="mt-5 text-xl font-bold text-[#14243A]">
                Services Coming Soon
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Our technicians are preparing their service listings.
                Approved services will appear here as soon as they are
                available.
              </p>
              <Link
                href="/services"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#14243A] px-6 text-sm font-bold text-white hover:bg-[#203957]"
              >
                Browse Services
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-[#729D20]">
            SIMPLE PROCESS
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#14243A]">
            How FixMate Works
          </h2>
          <p className="mt-3 text-slate-500">
            Getting your device repaired is easier than ever.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="text-3xl font-extrabold text-[#B8F34A]">
                {step.number}
              </span>
              <h3 className="mt-5 text-lg font-bold text-[#14243A]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#14243A] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-[#B8F34A]">
              WHY FIXMATE?
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">
              Repair Services You Can Trust
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-600 bg-[#1B304B] p-7"
              >
                <div className="flex size-14 items-center justify-center rounded-xl bg-[#B8F34A] text-[#14243A]">
                  <Icon size={27} />
                </div>
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-[#B8F34A] px-6 py-10 text-center text-[#14243A] sm:px-12">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Ready to Get Your Device Repaired?
            </h2>
            <p className="mt-3 text-sm text-slate-700">
              Find a repair service and book your technician today.
            </p>
            <Link
              href="/services"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-[#14243A] px-7 font-bold text-white transition hover:bg-[#203957]"
            >
              Find a Service
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
