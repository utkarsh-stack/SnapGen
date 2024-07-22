"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { getUserByEmail, getUserById } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";
import { Button } from "../ui/button";
import { createFriendRequest } from "@/lib/actions/friendRequest.action";

export const UserSearch = (
  {friendList, loggedInUserId}:{friendList:string[], loggedInUserId:string}
) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isFriend, setisFriend] = useState(false)


  async function executeSearch(userEmail: string) {
    try {
      const userFound = await getUserByEmail(userEmail)
      setUser(userFound)
      friendList.includes(userFound.clerkId) ? setisFriend(true): setisFriend(false)
    } catch (error) {
      setUser(null)
    }
  }

  async function sendFriendRequest({from, to, status}:FriendRequestParams) {
    try{
      const friendReqRecord = await createFriendRequest({from, to, status})
    }catch(error){
      console.log("Unable to send request")
    }
  }

  return (
    <>
      <div className="search">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
        />

        <Input
          className="search-field"
          placeholder="Search"
          onChange={(e) => executeSearch(e.target.value)}
        />
      </div>
      {user && (
        <div className='block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-row items-center space-x-5 shadow-lg p-4 space-y-4 m-4 w-full max-w-80'>
          <div style={{ borderRadius: '100%', overflow: 'hidden' }}>
            <Image
              src={user.photo!}
              alt="Profile pic"
              height={50}
              width={50}
            />
          </div>
          <div className="flex-1 w-1/2">
            <p>{user.firstName}</p>
            <p>{user.lastName}</p>
          </div>
          <Button
          disabled={isFriend}
          className="flex-1 w-1/2 bg-transparent hover:bg-transparent"
          onClick={()=>sendFriendRequest({from: loggedInUserId, to: user.clerkId, status:0})}
          >
            { (<Image
          src="/assets/icons/addFriend.svg"
          alt="search"
          width={30}
          height={30}
        />)}
          </Button>
        </div>
      )}
    </>
  );
};