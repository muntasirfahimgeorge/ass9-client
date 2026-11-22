
import Link from "next/link";
import { Search, SlidersHorizontal, Wrench, MapPin, ArrowUpDown } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import { getServices } from "@/lib/api/services";
import type { TServiceCategory, TServiceMode } from "@/types";

const categories: TServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const serviceModes: TServiceMode[] = ["Home Visit", "Shop Drop-off"];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

type SearchParams = {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const search = params.search?.trim() || "";
  const category = categories.includes(params.category as TServiceCategory)
    ? params.category!
    : "";
  const serviceMode = serviceModes.includes(params.serviceMode as TServiceMode)
    ? params.serviceMode!
    : "";
  const sort = sortOptions.some((option) => option.value === params.sort)
    ? params.sort!
    : "newest";

  const queryParams = new URLSearchParams();

  if (search) queryParams.set("search", search);
  if (category) queryParams.set("category", category);
  if (serviceMode) queryParams.set("serviceMode", serviceMode);
  if (sort) queryParams.set("sort", sort);

  const services = await getServices(queryParams.toString());

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <section className="bg-[#14243A] px-5 py-14 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#B8F34A]">
            <Wrench size={17} />
            FIXMATE SERVICES
          </div>

          <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
            Find the Right Repair Service
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Explore professional repair services for your smartphones,
            computers and home appliances. Choose a service and connect
            with a technician you can trust.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#14243A]">
            Browse Available Services
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Search and filter approved repair services.
          </p>
        </div>

        <form
          action="/services"
          method="GET"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search services
              </label>

              <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 focus-within:border-[#14243A]">
                <Search size={18} className="shrink-0 text-slate-400" />
                <input
                  id="search"
                  name="search"
                  type="search"
                  defaultValue={search}
                  placeholder="Search repair services..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                defaultValue={category}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#14243A]"
              >
                <option value="">All Categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="serviceMode"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Service Mode
              </label>

              <select
                id="serviceMode"
                name="serviceMode"
                defaultValue={serviceMode}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#14243A]"
              >
                <option value="">All Modes</option>
                {serviceModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sort"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Sort By
              </label>

              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#14243A]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <SlidersHorizontal size={15} />
              Refine your repair service search
            </p>

            <div className="flex gap-3">
              <Link
                href="/services"
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Clear Filters
              </Link>

              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#14243A] px-5 text-sm font-bold text-white transition-colors hover:bg-[#203957]"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>
        </form>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#14243A]">
              Available Repair Services
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {services.length} {services.length === 1 ? "service" : "services"} found
            </p>
          </div>

          <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <ArrowUpDown size={15} />
            Sorted by {sortOptions.find((option) => option.value === sort)?.label}
          </span>
        </div>

        {services.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#B8F34A]/20 text-[#14243A]">
              <MapPin size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#14243A]">
              No Services Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We could not find any repair services matching your search.
              Try changing your search term or filters.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex h-11 items-center rounded-lg bg-[#14243A] px-6 text-sm font-bold text-white hover:bg-[#203957]"
            >
              View All Services
            </Link>
          </div>
        ) : (
          <div className="mt-7 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
