
// COMPONENTS
import NotificationsDropdown from "./components/notificationDropdown/NotificationsDropdown";


export default function NavbarSettings() {
  return (
    <nav className="flex w-full h-[70px] items-center bg-white font-UberMove">
      {/* CENTRE : Breadcrumbs & Recherche */}
      <div className="flex h-full flex-1 items-center gap-20 px-8">
      </div>

      {/* DROITE : Actions Auth */}
      <div className="flex h-full min-w-[285px] gap-4">
        <div className="flex h-full w-3/4 items-center justify-end gap-3 bg-bl">
          <NotificationsDropdown />
        </div>
      </div>
    </nav>
  );
}