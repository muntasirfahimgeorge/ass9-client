
import { getMyProfile } from "@/lib/api/profile";
import ProfileForm from "@/components/dashboard/shared/ProfileForm";

export default async function TechnicianProfilePage() {
  const profile = await getMyProfile();

  return <ProfileForm profile={profile} />;
}
