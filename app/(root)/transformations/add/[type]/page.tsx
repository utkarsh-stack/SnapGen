import Header from '@/components/shared/Header'
import React from 'react'
import {transformationTypes} from '@/constants/index'
import TransformationForm from '@/components/shared/TransformationForm'
import { auth } from '@clerk/nextjs/server'
import { getUserById } from '@/lib/actions/user.action'
import {redirect} from 'next/navigation'
 
 

const AddTransformationTypePage = async ({params: {type}}: (SearchParamProps)) => {
  const transformationData = transformationTypes[type]
  const {userId} = auth()
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  return (
    <>
    <Header title={transformationData.title} subtitle={transformationData.subTitle}/>
    <section className='mt-10'>
      <TransformationForm 
      action='Add'
      userId={user._id}
      type = {transformationData.type as TransformationTypeKey}
      creditBalance={user.creditBalance}
      isPublicState={true}
      />  
    </section>
     
    </>
  )
}

export default AddTransformationTypePage