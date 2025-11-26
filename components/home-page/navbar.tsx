import Image from "next/image";
import { Bell, Globe, User } from "lucide-react";
import { useState } from "react";
import { SELLER_NAVBAR_PAGE_LINKS } from "@/constants/navbar-page-links";
import Link from "next/link";

function Navbar({ isSignedIn }: { isSignedIn: boolean | null }) {
  const languages = [
    { label: "English", value: "en" },
    { label: "ქართული", value: "ka" },
  ];

  const [selectedLang, setSelectedLang] = useState(languages[0]);

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
                  <button className="group relative text-gray-700 px-2 py-2 rounded-lg font-medium transition duration-300 ease-out hover:bg-linear-to-r hover:from-teal-500 hover:via-teal-400 hover:to-teal-600 hover:text-white cursor-pointer">
                    <span className="relative z-10">{link.label}</span>
                    <span className="pointer-events-none absolute inset-x-1 bottom-2 h-0.5 origin-left scale-x-0 translate-y-0 rounded-full bg-linear-to-r from-teal-400 via-teal-200 to-white transition-all duration-500 ease-out transform group-hover:scale-x-100 group-hover:translate-y-0.5" />
                  </button>
                </Link>
              ))}
            </div>
            <div className="hidden md:block h-8 w-px bg-gray-300" />
            <div className="flex items-center gap-x-4">
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
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
