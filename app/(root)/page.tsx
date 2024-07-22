import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { Collection } from '@/components/shared/Collection'
import { getAllImages, getFriendsImage, getUserImages } from '@/lib/actions/image.action'
import { IImage } from '@/lib/database/models/image.model'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
import { IUser } from '@/lib/database/models/user.model'




const Home = async ({searchParams}: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const friendList = user.friends
  const friends = await Promise.all(friendList.map(async (uid:string) => await getUserById(uid)))
  const friends_ids = friends.map((friend:{_id:string})=> friend._id)
  const searchQuery = (searchParams?.query as string) || '';

  // const images = await getAllImages({page, searchQuery})
  // const images = await getFriendsImage({ page, userId: user._id });
  const images = await getFriendsImage({ page, userId: friends_ids });

  return (
    <>
    <section className='home'>
      <h1 className='home-heading'>
        Unleash Your Imagination with SnapGen
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1,6).map((link) =>(
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2 pt-1"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt='icon-image' width={24} height={24}/>
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </h1>
    </section>
    <Collection
    hasSearch={true}
    images={images?.data}
    totalPages={images?.totalPages}
    page={page}
    />
    </>
  )
}

export default Home