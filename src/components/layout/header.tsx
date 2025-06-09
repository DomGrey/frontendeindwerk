import { Navigation } from "./navigation";
import { MobileNav } from "./mobile-nav";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center">
        <div className="flex items-center md:hidden">
          <MobileNav />
        </div>
        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Virtual Closet
            </span>
          </a>
          <Navigation />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search will be added here later */}
          </div>
          <nav className="flex items-center space-x-2">
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
