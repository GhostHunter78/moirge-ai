import Image from "next/image";
import { Bell, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { SELLER_NAVBAR_PAGE_LINKS } from "@/constants/navbar-page-links";
import Link from "next/link";

function Navbar({ isSignedIn }: { isSignedIn: boolean | null }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="shrink-0 flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain h-10 w-10"
              priority
            />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-x-10">
            <div className="hidden md:flex items-center gap-x-5">
              {SELLER_NAVBAR_PAGE_LINKS.map((link) => (
                <Link href={link.href} key={link.label}>
                  <button className="group relative text-gray-700 px-2 py-2 rounded-lg font-medium transition duration-300 ease-out hover:bg-teal-100 cursor-pointer">
                    <span className="relative z-10">{link.label}</span>
                    <span className="pointer-events-none absolute inset-x-1 bottom-2 h-0.5 origin-left scale-x-0 translate-y-0 rounded-full bg-linear-to-r from-teal-400 via-teal-200 to-white transition-all duration-500 ease-out transform group-hover:scale-x-100 group-hover:translate-y-0.5" />
                  </button>
                </Link>
              ))}
            </div>
            {/* Divider */}
            <div className="hidden md:block h-8 w-px bg-gray-300" />
            {/* Mobile menu */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                className={
                  "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 " +
                  (mobileNavOpen
                    ? "bg-gray-100"
                    : "bg-transparent hover:bg-gray-100")
                }
              >
                <span
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                  style={{
                    opacity: mobileNavOpen ? 0 : 1,
                    pointerEvents: mobileNavOpen ? "none" : "auto",
                  }}
                >
                  <Menu size={24} />
                </span>
                <span
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                  style={{
                    opacity: mobileNavOpen ? 1 : 0,
                    pointerEvents: mobileNavOpen ? "auto" : "none",
                  }}
                >
                  <X size={24} />
                </span>
              </button>
              <div
                className={
                  "fixed top-0 right-0 h-screen w-3/4 max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out " +
                  (mobileNavOpen ? "translate-x-0" : "translate-x-full")
                }
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-5 py-4 border-b">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} />
                    <button
                      onClick={() => setMobileNavOpen(false)}
                      aria-label="Close menu"
                      className="rounded-full hover:bg-gray-100 transition p-2"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <ul className="flex flex-col px-5 py-6 gap-4">
                    {SELLER_NAVBAR_PAGE_LINKS.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileNavOpen(false)}
                          className="block w-full text-lg font-medium text-gray-700 rounded-md px-3 py-2 transition hover:bg-teal-100"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <hr className="border-t border-gray-200 mb-4" />
                  <div className="flex flex-col gap-3 px-5">
                    <button className="border border-gray-300 rounded-md w-full py-2 flex items-center justify-center gap-2 mb-1">
                      <Image
                        src="/images/GBflag.png"
                        alt="GBflag"
                        width={16}
                        height={16}
                      />
                      <span className="text-gray-700 font-medium">EN</span>
                    </button>
                    {isSignedIn ? (
                      <div className="flex gap-2 w-full">
                        <button className="flex-1 border border-gray-300 rounded-xl py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer bg-white">
                          <span className="text-gray-700 font-medium">
                            Sign In
                          </span>
                        </button>
                        <button className="flex-1 rounded-xl py-2 flex items-center justify-center gap-2 transition cursor-pointer bg-linear-to-r from-teal-500 via-teal-400 to-teal-600 hover:from-teal-600 hover:to-teal-500">
                          <span className="text-white font-medium">
                            Get Started
                          </span>
                        </button>
                      </div>
                    ) : (
                      <button className="rounded-xl w-full py-2 flex items-center justify-center gap-2 transition cursor-pointer bg-linear-to-r from-teal-500 via-teal-400 to-teal-600 hover:from-teal-600 hover:to-teal-500">
                        <LogOut className="text-white" size={16} />
                        <span className="text-white font-medium">Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {mobileNavOpen && (
                <div
                  className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
                  onClick={() => setMobileNavOpen(false)}
                />
              )}
            </div>
            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-x-4">
              <button className="border border-gray-300 rounded-md px-4 py-1 flex items-center gap-2 cursor-pointer">
                <Image
                  src="/images/GBflag.png"
                  alt="GBflag"
                  width={16}
                  height={16}
                />
                <span className="text-gray-700 font-medium">EN</span>
              </button>
              {isSignedIn ? (
                <div className="flex items-center gap-x-2">
                  <button className="rounded-xl px-4 py-1 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer">
                    <span className="text-gray-700 font-medium">Sign In</span>
                  </button>
                  <button className="rounded-xl px-4 py-1 flex items-center gap-2 transition cursor-pointer bg-linear-to-r from-teal-500 via-teal-400 to-teal-600 hover:from-teal-600 hover:to-teal-500 ">
                    <span className="text-white font-medium">Get Started</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-x-4">
                  <button className="relative rounded-xl px-2 py-1 flex items-center transition cursor-pointer hover:bg-gray-100">
                    <span className="text-gray-700">
                      <Bell width={18} height={18} />
                    </span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                      0
                    </span>
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 transition cursor-pointer hover:bg-blue-200">
                    <User width={18} height={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
