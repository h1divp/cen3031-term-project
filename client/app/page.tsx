"use client";
import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from "@heroui/button";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Card } from "../components/Card";
import { AccountSection } from "../components/Account";
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white p-4 text-purple-500">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">GitGud At Studying</div>
          <ButtonGroup>
            <Button variant="ghost">Login</Button>
            <Button variant="ghost">Sign Up</Button>
          </ButtonGroup>
        </div>
      </nav>

      {/* Main Content - Three Columns */}
      <div className="flex-1 container mx-auto p-4 flex gap-4">
        {/* Column 1 - Recent Games */}
        <div className="flex-1 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Recent Games</h2>
          <div className="space-y-3">
            <Card title="Math Basics" details="50 cards" />
            <Card title="Sorting Algorithms" details="100 cards" />
          </div>
        </div>

        {/* Column 2 - Community Decks */}
        <div className="flex-1 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Community Decks</h2>
          <div className="space-y-3">
            <Card title="Another deck" details="70 cards" />
            <Card title="Another deck" details="70 cards" />
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex-1">
          <div className="grow bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Account</h2>
            <AccountSection />
          </div>
          <div className="grow bg-gray-100 p-4 mt-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Your Decks</h2>
            <div className="space-y-3">
              <Card title="Another deck" details="70 cards" />
              <Card title="Another deck" details="70 cards" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
