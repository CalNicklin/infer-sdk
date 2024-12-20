"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function Nav() {
  const { isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const activeSection = pathname === "/" ? "home" : pathname.slice(1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", section: "/" },
    { name: "Docs", section: "/docs" },
    { name: "Pricing", section: "/pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-sm border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div
          className={`transition-all duration-300 ${
            isScrolled ? "scale-90" : "scale-100"
          }`}
        >
          <Link
            href="/"
            className="text-2xl font-medium tracking-tight text-white/80"
          >
            infer
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.section}
              className={`
                px-3 py-2 text-sm transition-colors font-sans
                ${
                  activeSection ===
                  (item.section === "/" ? "home" : item.section.slice(1))
                    ? "text-white font-medium"
                    : "text-white/60 hover:text-white/80 font-normal"
                }
              `}
            >
              {item.name}
            </Link>
          ))}

          <div className="h-4 w-px bg-white/20 mx-2" />

          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                className="text-white/70 hover:text-white/80 transition-colors font-normal"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white/80 font-normal"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white/80 font-normal"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>

        <div className="sm:hidden">
          <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-screen border-white/10 backdrop-blur-sm bg-black/70">
              <div className="flex flex-col space-y-2 px-4 py-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.section}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      px-3 py-2 text-sm transition-colors font-sans text-left rounded-md
                      ${
                        activeSection ===
                        (item.section === "/" ? "home" : item.section.slice(1))
                          ? "text-white font-medium bg-white/10"
                          : "text-white/60 hover:text-white/80 hover:bg-white/5 font-normal"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-2" />
                {isSignedIn ? (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="text-white/70 hover:text-white/80 hover:bg-white/5 transition-colors font-normal justify-start"
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </Button>
                    <div className="flex justify-start pl-3">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-white/70 hover:text-white/80 hover:bg-white/5 w-full justify-start font-normal"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button
                        variant="ghost"
                        className="text-white/70 hover:text-white/80 hover:bg-white/5 w-full justify-start font-normal"
                      >
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
}
