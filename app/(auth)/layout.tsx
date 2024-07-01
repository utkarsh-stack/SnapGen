import React from 'react'

const Authentication = ({children}: {children: React.ReactNode}) => {
  return (
      <main className='auth'>{children}</main>   
  )
}

export default Authentication