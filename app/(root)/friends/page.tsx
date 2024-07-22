import Header from '@/components/shared/Header'
import { Search } from '@/components/shared/Search'
import { UserSearch } from '@/components/shared/UserSearch'
import { Button } from '@/components/ui/button';
import { getUserById, removeFriend } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'
import Image from 'next/image'
import UserCard from '@/components/shared/UserCard';
import { findAllFriendRequests } from '@/lib/actions/friendRequest.action';
const { userId } = auth();

const FriendsPage = async () => {
  // const [user, setUser] = useState(null);
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const friendList = user.friends
  const openFriendRequestList = await findAllFriendRequests(userId) 
  const openFriendRequests = openFriendRequestList.map((req: { from: string; }) => req.from)
  async function onClickUnfriend(userId:string, friendId:string) {
    const updatedUser = await removeFriend(userId, friendId)
  }


  return (
    <div className='flex flex-row w-full h-full'>
      <section className='flex-1 w-1/2'>
        <Header title={"Search for friends"} subtitle='Enter email Id of your friend and hit friend request icon to send friend request' />
        <UserSearch friendList={friendList} loggedInUserId={userId} />
      </section>
      <section className='flex-1 w-1/2'>
      <section className='h-1/2'>
        <Header title={"Friends (" + friendList.length+")" } subtitle={friendList.length===0?'You have 0 friends':'Click unfriend icon to unfriend and coins icon to send credits'} />
        <div>
        {
          friendList.map(async (uid: string) => {
            const friend = await getUserById(uid);
            return (
              <UserCard
              friendId={uid}
              firstName={friend.firstName}
              lastName={friend.lastName}
              loggedInUserId={userId}
              profilePicSrc={friend.photo}
              friendRequestCard={false}
              userCredit={user.creditBalance}
              key={uid}
              />
            )
          })
        }
        </div>
        </section>
        <section className='h-1/2'>
        <Header title={"Friend Requests (" + openFriendRequestList.length+ ")"} subtitle={openFriendRequestList.length===0?'You have 0 friend requests':'Accept or reject these friend requests'} />
        <div>
        {
          openFriendRequests.map(async (uid: string) => {
            const friend = await getUserById(uid);
            return (
              <UserCard
              friendId={uid}
              firstName={friend.firstName}
              lastName={friend.lastName}
              loggedInUserId={userId}
              profilePicSrc={friend.photo}
              friendRequestCard={true}
              userCredit={user.creditBalance}
              key={uid}
              />
            )
          })
        }
        </div>
        </section>
      </section>
    </div>
  )
}

export default FriendsPage