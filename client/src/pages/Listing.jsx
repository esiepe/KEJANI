import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { FaFaucet, FaHome, FaMapMarkerAlt, FaWifi } from 'react-icons/fa'
import { BiWifiOff } from 'react-icons/bi'
import { FaFaucetDrip } from 'react-icons/fa6'
const Listing = () => {
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const params = useParams()
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                }
                setListing(data)
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.listingId]); 
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
        {listing && !loading && !error && (
            <>
                <Swiper navigation>
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div className="h-[550px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="px-7">
                    <p className='text-2xl mt-7 font-semibold'>{listing.name} - KES {listing.rent}/month</p>
                    <p className="flex items-center mt-3 gap-2 text-slate-600 my-2 text-sm">
                        <FaMapMarkerAlt className='text-green-700' />
                        {listing.address}
                    </p>
                    <p className='text-slate-800'><span className='font-semibold text-black'>Description - </span>{listing.description}</p>
                    <ul className='flex items-center gap-4 sm:gap-6 text-green-900 font-semibold text-sm mt-2 flex-wrap'>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            <FaHome className='text-md' />
                            {listing.size}
                        </li>
                        <li className='flex items-center whitespace-nowrap'>
                            {listing.indoorPlumbing ? (
                            <div className='flex items-center gap-3'>
                                <FaFaucetDrip className='text-md'/>
                                <p>Water available</p>
                            </div>   
                            ) : (
                                <>
                                    <FaFaucet className='text-md'/>
                                    <p>No water</p>
                                </>
                            )}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            {listing.wifi ? (
                                <div className='flex items-center gap-3'>
                                    <FaWifi className='text-lg'/>
                                    <p>WiFi Available</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <BiWifiOff className='text-lg' />
                                    <p>No WiFi</p>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>    
            </>
        )}
    </main>
  )
}

export default Listing