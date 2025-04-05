"use client";

import { useUserContext } from "@/contexts/UserProvider"
import { Button, ButtonGroup } from "@heroui/button"
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const NavigationBar = () => {

  const session = useUserContext();
  const router = useRouter();

  const [displayName, setDisplayName] = useState<string>("no name");

  const signOutOnClick = () => {
    session?.signOut();
    router.refresh();
  }

  // Get user session data every page load by leaving the useEffect dependancies empty.

  useEffect(() => {
    session?.getSessionData();
  }, [])

  useEffect(() => {
    if (session?.user) {
      const { display_name } = session?.user?.user_metadata;
      setDisplayName(display_name);
    }
  }, [session]);

  return (
    <Navbar maxWidth="full">
      <NavbarBrand className="text-purple-700">
        {/*self made icon from figma*/}
        <svg width="111" height="100" viewBox="0 0 111 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="size-9 mr-1 pb-1">
          <rect x="55.0901" y="16.96" width="55.9099" height="76.1532" rx="8" fill="#7C1CD0" />
          <rect x="0.0110953" y="25.7221" width="61.9099" height="82.1532" rx="11" transform="rotate(-25.0841 0.0110953 25.7221)" fill="#7C1CD0" stroke="white" strokeWidth="6" />
        </svg>
        <Link className="font-bold text-2xl" href="/">GitGud</Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        {session?.user ? (
          <div className="flex flex-row items-center">
            <p className="mr-2">Logged in as <span className="font-bold">{displayName}</span></p>
            <Button variant="ghost" onClick={signOutOnClick}>Sign out</Button>
          </div>
        ) : (
          <ButtonGroup>
            <Button
              variant="ghost"
              onClick={() => router.push('/login')}
            >Log In</Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/signup')}
            >Sign Up</Button>
            {/*<SignInWithGoogle />*/}
          </ButtonGroup>
        )}
      </NavbarContent>
    </Navbar>
  )
}
