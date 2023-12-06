import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>
            Create a Listing
        </h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
                <input type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input type="checkbox" id="single-room" className='w-5'/>
                        <span>Single Room</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="double-room" className='w-5'/>
                        <span>Double Room</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="bedsitter" className='w-5'/>
                        <span>Bedsitter</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="one-bedroom" className='w-5'/>
                        <span>One Bedroom</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="two-bedroom" className='w-5'/>
                        <span>Two Bedrooms</span>
                    </div>
                </div>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                        <input type="checkbox"  id="indoor-plumbing" className='w-5' />
                        <span>Indoor plumbing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox"  id="wi-fi" className='w-5' />
                        <span>Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number"  id="units" min={1} max={50} required className='p-3 border border-gray-300 rounded-lg' />
                        <p>Units</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number"  id="rent" min={1} required className='p-3 border border-gray-300 rounded-lg' />
                        <div className="flex flex-col item-center">
                            <p>Rent</p>
                            <span className='text-xs'>(KES / month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input className='p-3 border border-gray-300 rounded w-full' type="file" id="images" accept='image/*' multiple/>
                    <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
                </div>
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}
