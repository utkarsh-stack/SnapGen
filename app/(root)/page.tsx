import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { Collection } from '@/components/shared/Collection'
import { getAllImages } from '@/lib/actions/image.action'


const Home = async ({searchParams}: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || '';

  const images = await getAllImages({page, searchQuery})
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
    totalPages={images?.totalPage}
    page={page}
    />
    </>
  )
}

export default Home