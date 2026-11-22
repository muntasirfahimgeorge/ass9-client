
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Camera,
  FileText,
  Save,
} from "lucide-react";
import {
  updateMyProfile,
  type TProfileFormState,
} from "@/lib/action/profile";
import type { TFixMateProfile } from "@/lib/api/profile";

type ProfileFormProps = {
  profile: TFixMateProfile;
};

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [area, setArea] = useState(profile.area ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [image, setImage] = useState(profile.image ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<
    NonNullable<TProfileFormState["errors"]>
  >({});

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

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
      setSuccess(result.success);
      setErrors(result.errors ?? {});
    } catch {
      setMessage("Something went wrong. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#14243A] outline-none transition focus:border-[#B8F34A] focus:ring-2 focus:ring-[#B8F34A]/20";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#14243A]";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#14243A]">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and update your personal information.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <section className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#14243A] text-2xl font-bold text-[#B8F34A]">
              {image ? (
                <Image
                  src={image}
                  alt="Profile"
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                initials || <UserRound size={36} />
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#14243A]">
              {name || "Your Name"}
            </h2>

            <p className="mt-1 break-all text-sm text-gray-500">
              {profile.email}
            </p>

            <span className="mt-3 rounded-full bg-[#B8F34A]/20 px-4 py-1 text-xs font-semibold capitalize text-[#14243A]">
              {profile.role}
            </span>
          </div>

          <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone size={17} className="shrink-0 text-[#14243A]" />
              <span>{phone || "No phone number added"}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin size={17} className="shrink-0 text-[#14243A]" />
              <span>{area || "No area added"}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#14243A]">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your profile details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="profile-name" className={labelClass}>
                Full Name
              </label>
              <input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
                placeholder="Enter your full name"
                required
                minLength={2}
                maxLength={80}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="profile-email" className={labelClass}>
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="profile-email"
                  value={profile.email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-gray-50 pl-11 text-gray-500`}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Email address cannot be changed.
              </p>
            </div>

            <div>
              <label htmlFor="profile-phone" className={labelClass}>
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="profile-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={`${inputClass} pl-11`}
                  placeholder="Enter your phone number"
                  maxLength={20}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="profile-area" className={labelClass}>
                Area / Location
              </label>
              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="profile-area"
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  className={`${inputClass} pl-11`}
                  placeholder="Enter your area"
                  maxLength={100}
                />
              </div>
              {errors.area && (
                <p className="mt-1 text-xs text-red-600">{errors.area}</p>
              )}
            </div>

            <div>
              <label htmlFor="profile-image" className={labelClass}>
                Profile Image URL
              </label>
              <div className="relative">
                <Camera
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="profile-image"
                  type="url"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  className={`${inputClass} pl-11`}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {errors.image && (
                <p className="mt-1 text-xs text-red-600">{errors.image}</p>
              )}
            </div>

            <div>
              <label htmlFor="profile-bio" className={labelClass}>
                About Me
              </label>
              <div className="relative">
                <FileText
                  size={17}
                  className="absolute left-4 top-4 text-gray-400"
                />
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className={`${inputClass} min-h-28 resize-y pl-11`}
                  placeholder="Write something about yourself..."
                  maxLength={500}
                />
              </div>
              {errors.bio && (
                <p className="mt-1 text-xs text-red-600">{errors.bio}</p>
              )}
            </div>

            {message && (
              <div
                className={`rounded-lg px-4 py-3 text-sm ${
                  success
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14243A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#203957] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Save size={17} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
