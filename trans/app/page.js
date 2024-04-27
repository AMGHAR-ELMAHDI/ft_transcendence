import Image from "next/image";
import React from 'react'
// import { useState } from 'react';
import SearchBar from "./_components/searchBar";

function page() {
  return (
    <div className='flex-1  w-full h-full flex flex-col'>
        <SearchBar/>
        <div className='flex-1 flex flex-col'>
            <div className='min-h-[20rem]'>Profile</div>
            <div className='flex-1 flex debug'> 
                <div className='flex-[2]'></div>
                <div className='flex-1'></div>
                <div className='flex-[2]'></div>
            </div>
        </div>
    </div>
  )
}

export default page