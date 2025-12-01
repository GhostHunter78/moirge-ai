"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Locale } from "@/lib/i18n";
import { setLocaleCookie } from "@/actions/locale";

interface LanguageOption {
  code: Locale;
  name: string;
  icon: React.ReactNode;
}

const GBFlag = () => (
  <Image
    src="/images/GBflag.png"
    alt="GB Flag"
    width={16}
    height={16}
    className="inline-block"
  />
);

const GeorgianFlag = () => (
  <Image
    src="/images/geoflag.png"
    alt="Georgian Flag"
    width={16}
    height={16}
    className="inline-block"
  />
);

const languages: LanguageOption[] = [
  { code: "en", name: "Eng", icon: <GBFlag /> },
  { code: "ge", name: "ქარ", icon: <GeorgianFlag /> },
];

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (locale: Locale) => {
    startTransition(async () => {
      await setLocaleCookie(locale);
      router.refresh();
    });
  };

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full md:w-auto">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isPending}
        >
          {currentLanguage.icon}
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-full md:w-auto">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="cursor-pointer"
            disabled={isPending}
          >
            <span className="mr-2">{language.icon}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
