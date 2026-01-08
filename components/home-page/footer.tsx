import { Link } from "@/lib/routing";
import { SELLER_NAVBAR_PAGE_LINKS } from "@/constants/navbar-page-links";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { Profile } from "@/types/user-profile";

function Footer({ userInfo }: { userInfo: Profile | null }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-linear-to-br from-[#f0f4ff] via-[#f9edfa] to-[#dde0fd]" />
        <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-linear-to-br from-[#b5d2fa]/50 to-[#e9e7fc]/0 rounded-full blur-3xl opacity-60" />
        <div className="absolute right-0 bottom-0 w-[350px] h-[350px] bg-linear-to-br from-[#d6a8ff]/40 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 px-6 py-12 md:px-16 lg:px-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-foreground">
                  Moirge AI
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                AI-powered ecommerce assistant for both buyers & sellers. Shop
                smarter. Sell faster.
              </p>
              {/* Social Media Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/80 hover:bg-white transition-colors flex items-center justify-center shadow-sm hover:shadow-md group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/80 hover:bg-white transition-colors flex items-center justify-center shadow-sm hover:shadow-md group"
                  aria-label="Google"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                  >
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.78-.07-1.53-.2-2.27H12v4.29h6.46c-.28 1.48-1.13 2.73-2.4 3.57v2.96h3.88c2.27-2.09 3.55-5.17 3.55-8.55z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-2.96c-1.08.72-2.47 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.29v3.11C3.26 21 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.34a7.18 7.18 0 0 1-.37-2.34c0-.81.13-1.6.35-2.34V6.55H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.45l3.98-3.11z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.94 1.21 15.22 0 12 0 7.31 0 3.26 3 1.29 6.55l3.96 3.11C6.22 6.86 8.87 4.75 12 4.75z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-foreground font-semibold text-lg mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {SELLER_NAVBAR_PAGE_LINKS(userInfo?.role).map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-foreground transition-colors opacity-0 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-foreground font-semibold text-lg mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-foreground transition-colors opacity-0 group-hover:opacity-100" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-foreground transition-colors opacity-0 group-hover:opacity-100" />
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-foreground transition-colors opacity-0 group-hover:opacity-100" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-foreground transition-colors opacity-0 group-hover:opacity-100" />
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-foreground font-semibold text-lg mb-4">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground text-sm">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  <a
                    href="mailto:support@moirge.ai"
                    className="hover:text-foreground transition-colors"
                  >
                    support@moirge.ai
                  </a>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  <a
                    href="tel:+1234567890"
                    className="hover:text-foreground transition-colors"
                  >
                    +995 555 123123
                  </a>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>123 Chavchavadze Avenue</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm text-center md:text-left">
                © {currentYear} Moirge AI. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
                <span className="text-border">•</span>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
                <span className="text-border">•</span>
                <Link
                  href="/cookies"
                  className="hover:text-foreground transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
