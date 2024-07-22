"use client";
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { addFriend, removeFriend } from '@/lib/actions/user.action';
import { acceptFriendRequest, rejectFriendRequest } from '@/lib/actions/friendRequest.action';
import { ShareCreditDialogue } from './ShareCreditDialogue';
// import ShareCreditDialogue from './ShareCreditDialogue';


const UserCard = ({
  friendId,
  firstName,
  lastName,
  loggedInUserId,
  profilePicSrc,
  friendRequestCard = false,
  userCredit
}: {
  friendId: string,
  firstName: string,
  lastName: string,
  loggedInUserId: string,
  profilePicSrc: string,
  friendRequestCard: boolean,
  userCredit: number
}) => {
  async function onClickUnfriend(userId: string, friendId: string) {
    try {
      const updatedUser = await removeFriend(userId, friendId)
      const updatedFriend = await removeFriend(friendId, userId)
    } catch (error) {
      console.log("Error occured in deleting friend")
    }
  }

  async function onClickAccept(userId: string, friendId: string) {
    try {
      const updatedFriendRequestRecord = await acceptFriendRequest({ from: friendId, to: userId, status: 0 })
      const updatedUser = await addFriend(userId, friendId)
      const updatedFriend = await addFriend(friendId, userId)
    } catch (error) {
      console.log("Error occured in adding friend")
    }
  }

  async function onClickReject(userId: string, friendId: string) {
    try {
      const updatedFriendRequestRecord = await rejectFriendRequest({ from: friendId, to: userId, status: 0 })
    } catch (error) {
      console.log("Error occured in rejecting friend request")
    }
  }

  return (
    <div className='block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-row items-center space-x-5 shadow-lg p-4 space-y-4 m-4 w-full max-w-80'>
      <div style={{ borderRadius: '100%', overflow: 'hidden' }}>
        <Image
          src={profilePicSrc!}
          alt="Profile pic"
          height={50}
          width={50}
        />
      </div>
      <div className='flex-1 w-1'>
        <p >{firstName}</p>
        <p>{lastName}</p>
      </div>
      {
        !friendRequestCard && (
          <>
            
            <Button className='flex-1 w-1/4 bg-transparent hover:bg-transparent'
              onClick={() => onClickUnfriend(loggedInUserId, friendId)}
            ><Image
                src="/assets/icons/unfriend.svg"
                alt="unfriend"
                width={30}
                height={30}
                className='hover:cursor-pointer'
              /></Button>
            <div className='flex-1 w-1/4 '>
              <ShareCreditDialogue friendName={firstName} userCredit={userCredit} friendId={friendId} userId={loggedInUserId} />
            </div>
          </>
        )
      }
      {
        friendRequestCard && (
          <>
            <Button className='flex-1 w-1/4 bg-transparent hover:bg-transparent'
              onClick={() => onClickAccept(loggedInUserId, friendId)}
            ><Image
            src="/assets/icons/accept.svg"
            alt="unfriend"
            width={30}
            height={30}
            className='hover:cursor-pointer'
          /></Button>
            <Button className='flex-1 w-1/4 bg-transparent hover:bg-transparent'
              onClick={() => onClickReject(loggedInUserId, friendId)}
            ><Image
            src="/assets/icons/reject.svg"
            alt="unfriend"
            width={30}
            height={30}
            className='hover:cursor-pointer'
          /></Button>
          </>
        )
      }
    </div>
  )
}

export default UserCard