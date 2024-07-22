"use client";
import React from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';


const FriendsTab = ({userId, friendList}: {userId: string; friendList:[]}) => {
  const router = useRouter();
  return (
    // <div>
       <div className="profile-image-manipulation hover:cursor-pointer" onClick={() => router.push("/friends")}>
          <p className="p-14-medium md:p-16-medium">FRIENDS</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/friends.svg"
              alt="coins"
              width={40}
              height={40}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{friendList.length}</h2>
          </div>
        </div>
    // </div>
  )
}

export default FriendsTab