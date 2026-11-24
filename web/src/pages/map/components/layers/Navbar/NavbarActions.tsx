import TourButton from "../../../../../components/tour/TourButton";
import NewsBell from "../../../../../components/navbar/components/newsPopup/NewsBell";
import UserProfile from "./UserProfile";

export default function NavbarActions() {
  return (
    <div className="flex items-center gap-1">
      <TourButton />
      <NewsBell />
      <div className="mx-1 hidden h-5 w-px bg-[#1c1c1e]/10 sm:block dark:bg-white/10" />
      <UserProfile />
    </div>
  );
}
