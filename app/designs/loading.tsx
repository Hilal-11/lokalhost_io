import React from 'react'
import { Spinner } from '@/components/ui/spinner';

function loading() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <Spinner/>
    </div>
  )
}

export default loading
