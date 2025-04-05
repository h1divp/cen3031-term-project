"use client";

import { useQueryContext } from "@/contexts/QueryProvider";
import { useUserContext } from "@/contexts/UserProvider";
import { Database, Json } from "@/types/database.types";
import { Avatar } from "@heroui/avatar";
import { colorVariants } from "@heroui/theme";
import { User } from "@supabase/supabase-js";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const AccountSection = () => {

  type profileColorType = Database["public"]["Tables"]["user_storage"]["Row"]["profile_color"];

  const session = useUserContext();
  const query = useQueryContext();

  const [createdDate, setCreatedDate] = useState<Date | undefined>(undefined);
  const [displayName, setDisplayName] = useState<string>("no name");
  const [profileColor, setProfileColor] = useState<profileColorType>({ color: "#ff0000" });

  // Runs after session changes
  useEffect(() => {
    if (session?.user) {
      query?.getUserStorageRowFromId(session?.user?.id);
    }
  }, [session]);

  // Runs after query changes
  useEffect(() => {
    if (session?.user && query?.userData) {
      const { display_name } = session?.user?.user_metadata;
      setDisplayName(display_name);
      setCreatedDate(new Date(session?.user?.created_at));
      setProfileColor(query.userData.profile_color);
    }
  }, [query])

  return (
    <>
      {session?.user && query?.userData ? (
        <div className="flex flex-col">
          {/*"name" field must be left as a space to get rid of icon*/}
          <Avatar className="w-20 h-20 mx-auto" style={{ "backgroundColor": profileColor?.color }} name=" " isBordered />
          <p className="mt-2 text-center text-2xl font-black">
            {displayName}
          </p>
          <div className="flex flex-col mt-1 text-lg text-left">
            <div className="flex flex-col place-content-around">
              <span>Games won: {query?.userData.games_won}</span>
              <span>Decks created: {query?.userData.decks_created}</span>
              <span>Most points: {query?.userData.points_total}</span>
              <span>Account created: {createdDate?.toDateString()}</span>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
