"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookA,
  BookOpen,
  Crown,
  Flame,
  GitCompare,
  Globe2,
  History,
  Lock,
  LogIn,
  LogOut,
  Menu,
  Mic,
  Moon,
  Settings,
  ShieldAlert,
  Sun,
  UserPlus,
  X,
} from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import { Button } from "@/components/ui/button";

export function AppNavigation({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    state,
    authUser,
    theme,
    toggleTheme,
    logoutUser,
    skipOnboarding,
    loading,
    authInitialized,
  } = useAccentLab();
  const profile = state?.profile;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isLandingPage = pathname === "/";
  const isOnboardingPage = pathname === "/onboarding";

  // Check user in state snapshot
  const userInState = authUser.email
    ? state?.users.find((u) => u.email.toLowerCase() === authUser.email.toLowerCase())
    : null;

  // Check if current user is superadmin
  const isSuperAdmin =
    authUser.role === "superadmin" ||
    profile?.role === "superadmin" ||
    userInState?.role === "superadmin" ||
    authUser.email?.toLowerCase() === "admin@accentlab.ai";

  // Check if onboarding is completed
  const hasCompletedOnboarding =
    isSuperAdmin ||
    Boolean(
      authUser.onboardingCompleted ||
      profile?.onboardingCompleted ||
      userInState?.onboardingCompleted
    );

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Route & Onboarding Redirect Guards:
  useEffect(() => {
    if (!authInitialized || !authUser.isAuthenticated) return;

    // 1. If logged in user visits /login or /register, redirect to dashboard (or onboarding if incomplete)
    if (isAuthPage) {
      router.replace(hasCompletedOnboarding ? "/dashboard" : "/onboarding");
      return;
    }

    // 2. If learner on first login has NOT completed onboarding and is in the authenticated workspace, redirect to /onboarding
    if (loading) return;

    if (!hasCompletedOnboarding && !isOnboardingPage && !isLandingPage) {
      router.replace("/onboarding");
      return;
    }
  }, [
    authInitialized,
    authUser.isAuthenticated,
    isSuperAdmin,
    hasCompletedOnboarding,
    isAuthPage,
    isOnboardingPage,
    isLandingPage,
    loading,
    router,
  ]);

  // Wait for auth initialization from localStorage to prevent flash or premature redirects
  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6] flex items-center justify-center">
        <div className="font-serif text-sm text-[#78756E] dark:text-[#9E9A90]">
          Loading workspace...
        </div>
      </div>
    );
  }

  if (authUser.isAuthenticated && isAuthPage) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6] flex items-center justify-center px-4"
      >
        <div className="rounded-xl border border-[#E5E0D5] bg-white px-6 py-5 text-center dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <p className="font-serif text-lg font-semibold text-[#141413] dark:text-[#F3EFE6]">
            You are already signed in as {authUser.name}
          </p>
          <p className="mt-1 text-xs text-[#4A4842] dark:text-[#B8B3A8]">
            Redirecting to your workspace...
          </p>
        </div>
      </div>
    );
  }

  // 1. Public Routes ("/", "/login", "/register") render WITHOUT the dashboard layout
  if (isLandingPage || isAuthPage) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6] relative overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:border focus:border-[#1B4332] focus:bg-[#FBF9F5] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-[#141413] dark:focus:bg-[#1E1E1B] dark:focus:text-[#F3EFE6] dark:focus:border-[#6EE7B7]"
        >
          Skip to main content
        </a>
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to Warm Off-White Light Mode"
                : "Switch to Obsidian Dark Mode"
            }
            className="rounded-full border-[#D2CBB8] bg-white px-3.5 py-2 text-xs font-semibold text-[#141413] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 text-[#F4A261]" aria-hidden="true" />
                <span className="hidden sm:inline">Off-White Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" aria-hidden="true" />
                <span className="hidden sm:inline">Obsidian Dark</span>
              </>
            )}
          </Button>
        </div>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    );
  }

  // 2. Private Route Guard: Every route other than "/", "/login", "/register" requires authentication
  if (!authUser.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6] flex flex-col items-center justify-center px-4 py-12">
        <main
          id="main-content"
          tabIndex={-1}
          className="w-full max-w-lg rounded-2xl border border-[#E5E0D5] bg-white p-6 sm:p-8 dark:border-[#2E2D29] dark:bg-[#1E1E1B]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E0D5] pb-4 mb-6 dark:border-[#2E2D29]">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45]">
                <Activity className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                Formant
              </span>
            </Link>
            <span className="inline-flex items-center gap-1 rounded-md border border-[#D2CBB8] bg-[#F4F1EA] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#B84A27] dark:border-[rgba(244,162,97,0.35)] dark:bg-[rgba(184,74,39,0.25)] dark:text-[#F4A261]">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Protected ({pathname})
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
            Sign In Required
          </h1>
          <p className="mt-2 text-sm text-[#4A4842] leading-relaxed dark:text-[#B8B3A8]">
            This workspace requires an authenticated account. Sign in with your
            email and password or create a new account to access{" "}
            <code className="font-mono text-xs text-[#1B4332] dark:text-[#6EE7B7]">{pathname}</code>.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button asChild className="w-full">
              <Link href="/login">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Sign In with Email
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Create Account
              </Link>
            </Button>
          </div>

          <div className="mt-6 border-t border-[#E5E0D5] pt-4 text-xs dark:border-[#2E2D29]">
            <Link href="/" className="text-[#78756E] hover:text-[#141413] dark:text-[#9E9A90] dark:hover:text-[#F3EFE6]">
              ← Return to Public Landing Page
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Standalone Onboarding layout: Only for first-time learners who have NOT completed onboarding
  const showStandaloneOnboarding = !isSuperAdmin && !hasCompletedOnboarding && isOnboardingPage;
  if (showStandaloneOnboarding) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6] flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:border focus:border-[#1B4332] focus:bg-[#FBF9F5] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-[#141413] dark:focus:bg-[#1E1E1B] dark:focus:text-[#F3EFE6] dark:focus:border-[#6EE7B7]"
        >
          Skip to main content
        </a>
        <header
          role="banner"
          className="flex h-16 items-center justify-between border-b border-[#E5E0D5] bg-[#FBF9F5] px-4 sm:px-8 dark:border-[#2E2D29] dark:bg-[#111110]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45]">
                <Activity className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#141413] dark:text-[#F3EFE6]">
                Formant
              </span>
            </Link>
            <span className="hidden md:inline-flex rounded-md border border-[#1B4332]/30 bg-[#E9F2EE] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#1B4332] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35 dark:text-[#6EE7B7]">
              Initial L1 &amp; Acoustic Calibration
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              aria-label={
                theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-[#F4A261]" aria-hidden="true" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-[#1B4332]" aria-hidden="true" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                await skipOnboarding();
                router.replace("/dashboard");
              }}
              className="hidden sm:inline-flex text-xs font-semibold"
            >
              Skip to Dashboard
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                logoutUser();
                router.push("/");
              }}
              aria-label="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    );
  }

  // 3. Strict RBAC Check: Normal Users ("learner") MUST NOT access "/admin"
  if (pathname?.startsWith("/admin") && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6] flex flex-col items-center justify-center px-4 py-12">
        <main
          id="main-content"
          tabIndex={-1}
          className="w-full max-w-md rounded-2xl border border-[#E5E0D5] bg-white p-6 sm:p-8 text-center dark:border-[#2E2D29] dark:bg-[#1E1E1B]"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9ECE8] text-[#B84A27] dark:bg-[rgba(184,74,39,0.25)] dark:text-[#F4A261]">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
            Restricted SuperAdmin Console
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#4A4842] leading-relaxed dark:text-[#B8B3A8]">
            Your current session (<strong className="text-[#141413] dark:text-[#F3EFE6]">{authUser.name}</strong>) is
            authenticated with the standard <strong>Learner</strong> role. Normal learners cannot
            view or access SuperAdmin governance tools.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Return to Learner Dashboard
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 4. Build Role-Filtered Sidebar Navigation (Normal users NEVER see SuperAdmin Console)
  const navGroups = [
    {
      section: "Practice & Progress",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/assessment", label: "Assessment", icon: Mic },
        { href: "/lessons", label: "Lessons", icon: BookOpen },
        { href: "/phonetics", label: "Phonetics Guide", icon: BookA },
        { href: "/compare", label: "Compare Progress", icon: GitCompare },
        { href: "/history", label: "History", icon: History },
      ],
    },
    {
      section: "Account",
      items: [
        {
          href: "/onboarding",
          label: "Language Profile",
          icon: Globe2,
        },
        {
          href: "/settings",
          label: "Settings",
          icon: Settings,
        },
      ],
    },
    ...(isSuperAdmin
      ? [
          {
            section: "Administration",
            items: [
              {
                href: "/admin",
                label: "Admin Console",
                icon: Crown,
              },
            ],
          },
        ]
      : []),
  ];

  const activeNavItem = navGroups
    .flatMap((g) => g.items)
    .find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/" && pathname?.startsWith(item.href))
    );

  const bottomBarItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/assessment", label: "Assess", icon: Mic },
    { href: "/lessons", label: "Lessons", icon: BookOpen },
    { href: "/compare", label: "Compare", icon: GitCompare },
    isSuperAdmin
      ? { href: "/admin", label: "Admin", icon: Crown }
      : { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:border focus:border-[#1B4332] focus:bg-[#FBF9F5] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-[#141413] dark:focus:bg-[#1E1E1B] dark:focus:text-[#F3EFE6] dark:focus:border-[#6EE7B7]"
      >
        Skip to main content
      </a>

      {/* Desktop Left Vertical Sidebar */}
      <aside
        aria-label="Primary Sidebar Navigation"
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-[#E5E0D5] bg-[#F4F1EA] dark:border-[#2E2D29] dark:bg-[#181816]"
      >
        {/* Brand Header: Exact h-16 (64px) + border-b border-[#E5E0D5] matching Top Nav (#10) */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-[#E5E0D5] dark:border-[#2E2D29]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45]">
              <Activity className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#141413] dark:text-[#F3EFE6]">
              Formant
            </span>
          </Link>
        </div>

        {/* Target Variety & L1 Telemetry Pill */}
        {profile && (
          <div className="mx-4 mt-4 rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
            <div className="flex items-center justify-between text-[11px] text-[#78756E] dark:text-[#9E9A90]">
              <span className="uppercase tracking-wider font-semibold">
                {isSuperAdmin ? "Active Profile" : "Target Variety"}
              </span>
              <span className="font-mono font-semibold text-[#1B4332] dark:text-[#6EE7B7]">
                {profile.targetAccentId || "en-US"}
              </span>
            </div>
            <div className="mt-1 font-serif text-sm font-semibold text-[#141413] dark:text-[#F3EFE6]">
              {isSuperAdmin ? authUser.name : "General American English"}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-[#EFECE4] pt-2 text-[11px] text-[#4A4842] dark:border-[#2E2D29] dark:text-[#B8B3A8]">
              <span>L1: {profile.nativeLanguage}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#9A5B13] dark:text-[#F4A261]">
                <Flame className="h-3 w-3 fill-[#9A5B13] dark:fill-[#F4A261]" aria-hidden="true" />
                {profile.streakDays}d streak
              </span>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav
          aria-label="Workspace Sections"
          className="flex-1 space-y-6 px-3 py-5 overflow-y-auto"
        >
          {navGroups.map((group) => (
            <div key={group.section}>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#78756E] dark:text-[#9E9A90]">
                {group.section}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                          : "text-[#4A4842] hover:bg-[#EAE5DA] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:bg-[#1E1E1B] dark:hover:text-[#F3EFE6]"
                      }`}
                    >
                      <Icon
                        aria-hidden="true"
                        className={`h-4 w-4 ${
                          isActive ? "text-[#FFFFFF]" : "text-[#78756E] dark:text-[#9E9A90]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Authenticated User Card (#6: Settings and Role buttons hidden) */}
        <div className="border-t border-[#E5E0D5] bg-[#EFECE4]/70 p-4 dark:border-[#2E2D29] dark:bg-[#141413]">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#141413] dark:text-[#F3EFE6]">
                {authUser.name}
              </p>
              <p className="truncate font-mono text-[11px] text-[#78756E] dark:text-[#9E9A90]">
                {authUser.email}
              </p>
            </div>
            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                isSuperAdmin
                  ? "border-[#9A5B13] bg-[#FBF4E6] text-[#9A5B13] dark:border-[rgba(244,162,97,0.35)] dark:bg-[rgba(184,74,39,0.25)] dark:text-[#F4A261]"
                  : "border-[#D2CBB8] bg-[#FBF9F5] text-[#1B4332] dark:border-[rgba(110,231,183,0.35)] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]"
              }`}
            >
              {authUser.role}
            </span>
          </div>

          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                logoutUser();
                router.push("/");
              }}
              className="w-full justify-center text-xs"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Workspace Menu"
        >
          <div
            className="fixed inset-0 bg-[#141413]/60 dark:bg-black/80"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 flex w-72 max-w-[82vw] flex-col border-r border-[#E5E0D5] bg-[#F4F1EA] text-[#141413] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#F3EFE6]">
            <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-[#E5E0D5] dark:border-[#2E2D29]">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45]">
                  <Activity className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="font-serif text-lg font-bold tracking-tight text-[#141413] dark:text-[#F3EFE6]">
                  Formant
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D2CBB8] bg-[#FBF9F5] text-[#141413] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {profile && (
              <div className="mx-3 mt-3 rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                <div className="flex items-center justify-between text-[10px] text-[#78756E] dark:text-[#9E9A90]">
                  <span className="uppercase tracking-wider font-semibold">
                    {isSuperAdmin ? "Active Profile" : "Target Variety"}
                  </span>
                  <span className="font-mono font-semibold text-[#1B4332] dark:text-[#6EE7B7]">
                    {profile.targetAccentId || "en-US"}
                  </span>
                </div>
                <div className="mt-1 font-serif text-xs font-semibold text-[#141413] dark:text-[#F3EFE6]">
                  {isSuperAdmin ? authUser.name : "General American English"}
                </div>
                <div className="mt-1.5 flex items-center justify-between border-t border-[#EFECE4] pt-1.5 text-[11px] text-[#4A4842] dark:border-[#2E2D29] dark:text-[#B8B3A8]">
                  <span>L1: {profile.nativeLanguage}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#9A5B13] dark:text-[#F4A261]">
                    <Flame className="h-3 w-3 fill-[#9A5B13] dark:fill-[#F4A261]" aria-hidden="true" />
                    {profile.streakDays}d streak
                  </span>
                </div>
              </div>
            )}

            <nav className="flex-1 space-y-5 px-3 py-4 overflow-y-auto">
              {navGroups.map((group) => (
                <div key={group.section}>
                  <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#78756E] dark:text-[#9E9A90]">
                    {group.section}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname?.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                            isActive
                              ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                              : "text-[#4A4842] hover:bg-[#EAE5DA] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:bg-[#1E1E1B] dark:hover:text-[#F3EFE6]"
                          }`}
                        >
                          <Icon
                            aria-hidden="true"
                            className={`h-4 w-4 ${
                              isActive ? "text-[#FFFFFF]" : "text-[#78756E] dark:text-[#9E9A90]"
                            }`}
                          />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t border-[#E5E0D5] bg-[#EFECE4]/70 p-3 dark:border-[#2E2D29] dark:bg-[#141413]">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[#141413] dark:text-[#F3EFE6]">
                    {authUser.name}
                  </p>
                  <p className="truncate font-mono text-[10px] text-[#78756E] dark:text-[#9E9A90]">
                    {authUser.email}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                    isSuperAdmin
                      ? "border-[#9A5B13] bg-[#FBF4E6] text-[#9A5B13] dark:border-[rgba(244,162,97,0.35)] dark:bg-[rgba(184,74,39,0.25)] dark:text-[#F4A261]"
                      : "border-[#D2CBB8] bg-[#FBF9F5] text-[#1B4332] dark:border-[rgba(110,231,183,0.35)] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]"
                  }`}
                >
                  {authUser.role}
                </span>
              </div>

              <div className="mt-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                    router.push("/");
                  }}
                  className="w-full justify-center text-xs"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area (#9: SuperAdmin top banner removed so Top Nav aligns seamlessly with Sidenav) */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
        {/* Clean Editorial Top Utility Bar: Sticky, h-16 (64px) + hairline bottom border */}
        <header
          role="banner"
          className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-[#E5E0D5] bg-[#FBF9F5]/95 px-4 sm:px-8 backdrop-blur-sm dark:border-[#2E2D29] dark:bg-[#111110]/95"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D2CBB8] bg-[#FFFFFF] text-[#141413] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link
              href="/dashboard"
              className="lg:hidden font-serif text-base sm:text-lg font-bold text-[#141413] dark:text-[#F3EFE6] shrink-0"
            >
              Formant
            </Link>
            <span className="hidden sm:inline lg:hidden text-[#D2CBB8] dark:text-[#35332E]">/</span>
            <span className="truncate font-serif text-sm sm:text-base font-semibold text-[#141413] dark:text-[#F3EFE6]">
              {activeNavItem?.label || "Workspace"}
            </span>
          </div>

          {/* Right controls (#7: Settings button removed from topnav) */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <Link href="/phonetics" aria-label="Open Phonetics Guide">
                <BookA className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" aria-hidden="true" />
                <span className="hidden sm:inline">Phonetics Guide</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to Warm Off-White Light Mode"
                  : "Switch to Editorial Dark Mode"
              }
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-[#F4A261]" aria-hidden="true" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" aria-hidden="true" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                logoutUser();
                router.push("/");
              }}
              aria-label="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Mobile Quick Nav Bar */}
        <nav
          aria-label="Mobile Sub-Navigation"
          className="flex lg:hidden overflow-x-auto border-b border-[#E5E0D5] bg-[#F4F1EA] px-3 py-2 gap-1.5 no-scrollbar dark:border-[#2E2D29] dark:bg-[#181816]"
        >
          {navGroups.flatMap((g) => g.items).map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${
                  isActive
                    ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                    : "text-[#4A4842] bg-[#FBF9F5] border border-[#E5E0D5] dark:text-[#B8B3A8] dark:bg-[#161614] dark:border-[#2E2D29]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Page Content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 overflow-x-hidden pb-20 lg:pb-0"
        >
          {children}
        </main>

        {/* Fixed Mobile Bottom Dock */}
        <nav
          aria-label="Mobile Bottom Dock"
          className="fixed bottom-0 inset-x-0 z-30 grid grid-cols-5 border-t border-[#E5E0D5] bg-[#FBF9F5] px-1 py-1.5 lg:hidden dark:border-[#2E2D29] dark:bg-[#181816]"
        >
          {bottomBarItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[10px] font-semibold transition-colors ${
                  isActive
                    ? "text-[#1B4332] dark:text-[#6EE7B7]"
                    : "text-[#78756E] hover:text-[#141413] dark:text-[#9E9A90] dark:hover:text-[#F3EFE6]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-[#1B4332] dark:text-[#6EE7B7]" : "text-[#78756E] dark:text-[#9E9A90]"
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate max-w-full px-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
