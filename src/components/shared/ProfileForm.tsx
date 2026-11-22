
"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, UserRound, Mail, Phone, MapPin, FileText, ShieldCheck, Loader2, Save } from "lucide-react";
import { updateMyProfile } from "@/lib/action/profile";
import type { TFixMateProfile } from "@/lib/api/profile";

type ProfileFormProps = {
  profile: TFixMateProfile;
};

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [area, setArea] = useState(profile.area || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [image, setImage] = useState(profile.image || "");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrors({});
    setSuccess(false);

    try {
      const result = await updateMyProfile({
        name,
        phone,
        area,
        bio,
        image,
      });

      setMessage(result.message);

      if (result.success) {
        setSuccess(true);
      } else {
        setErrors(result.errors || {});
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#14243A] focus:ring-2 focus:ring-[#14243A]/10";

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[2px] text-[#789c32]">
          Account Settings
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#14243A]">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 bg-[#14243A]" />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex justify-center">
              <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#B8F34A] text-3xl font-extrabold text-[#14243A] shadow-md">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  initials || <UserRound size={36} />
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-[#14243A]">
                {profile.name}
              </h2>
              <p className="mt-1 break-all text-sm text-slate-500">
                {profile.email}
              </p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#B8F34A]/20 px-4 py-1.5 text-xs font-bold capitalize text-[#526e20]">
                <ShieldCheck size={14} />
                {profile.role}
              </span>
            </div>

            <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={17} className="shrink-0 text-[#789c32]" />
                <span className="break-all">{profile.email}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={17} className="shrink-0 text-[#789c32]" />
                <span>{phone || "No phone number added"}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={17} className="shrink-0 text-[#789c32]" />
                <span>{area || "No area added"}</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 border-b border-slate-100 pb-5">
            <h2 className="text-xl font-bold text-[#14243A]">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update your details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>
                <UserRound size={16} />
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Enter your full name"
                minLength={2}
                maxLength={80}
                required
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                <Mail size={16} />
                Email Address
              </label>
              <input
                value={profile.email}
                disabled
                className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
              />
              <p className="mt-1 text-xs text-slate-400">
                Email address cannot be changed.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                <Phone size={16} />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="Enter your phone number"
                maxLength={20}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                <MapPin size={16} />
                Your Area
              </label>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className={inputClass}
                placeholder="Enter your area"
                maxLength={100}
              />
              {errors.area && (
                <p className="mt-1 text-xs text-red-600">{errors.area}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                <Camera size={16} />
                Profile Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className={inputClass}
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && (
                <p className="mt-1 text-xs text-red-600">{errors.image}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                <FileText size={16} />
                About You
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={`${inputClass} min-h-32 resize-y`}
                placeholder="Write something about yourself..."
                maxLength={500}
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {bio.length}/500
              </p>
              {errors.bio && (
                <p className="mt-1 text-xs text-red-600">{errors.bio}</p>
              )}
            </div>

            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  success
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14243A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#203b5d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
