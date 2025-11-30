import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile exists and is complete
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username, phone, role")
        .eq("id", data.user.id)
        .single();

      // If profile doesn't exist, create one with null values
      let isProfileIncomplete = false;
      if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist, create it using upsert to be safe
        const { error: insertError } = await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            email: data.user.email || "",
            username: null,
            phone: null,
            role: null,
          },
          {
            onConflict: "id",
          }
        );

        if (insertError) {
          console.error("Failed to create profile in callback:", insertError);
        }
        // Newly created profile is incomplete
        isProfileIncomplete = true;
      } else if (profile) {
        // Check if existing profile is incomplete (username, phone, or role is null)
        isProfileIncomplete =
          profile.username === null ||
          profile.phone === null ||
          profile.role === null;
      } else {
        // If we can't fetch the profile and it's not a "not found" error, assume incomplete
        isProfileIncomplete = true;
      }

      if (isProfileIncomplete) {
        // Redirect to complete-profile page with default locale
        // The middleware will handle locale routing
        return NextResponse.redirect(`${origin}/en/complete-profile`);
      }

      // Profile is complete, redirect to intended destination
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
