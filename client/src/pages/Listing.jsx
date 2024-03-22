import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { useSelector } from 'react-redux'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css/bundle'
import { FaFaucet, FaHome, FaMapMarkerAlt, FaWifi, FaRoad } from 'react-icons/fa'
import { BiWifiOff } from 'react-icons/bi'
import { FaFaucetDrip } from 'react-icons/fa6'
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api"
import { MdTimer } from "react-icons/md";
import Contact from '../components/Contact'

const Listing = () => {
    SwiperCore.use([Autoplay, Navigation, Pagination])
    const [listing, setListing] = useState(null)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [contact, setContact] = useState(false)
    const params = useParams()
    const { currentUser } = useSelector((state) => state.user)
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
                    <Swiper 
                        navigation
                        slidesPerView={1}
                        pagination={{ type: "progressbar" }}
                        effect="fade"
                        modules={[EffectFade]}
                        autoplay={{ delay: 3000 }}
                    >
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[300px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="flex flex-row mx-auto p-3 my-7 gap-1">
                            <div className={`${listing.lat && listing.lng && isLoaded ? 'm-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 lg:space-x-5' : 'flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'}`}>
                                <div className="w-full">
                                    <p className='text-2xl mt-7 font-semibold'>{listing.name} - KES {listing.rent}/month</p>
                                    <p className="flex items-center mt-3 gap-2 text-slate-600 my-2 text-sm">
                                        <FaMapMarkerAlt className='text-green-700' />
                                        {listing.address}
                                    </p>
                                    <p className='text-slate-800 my-3'><span className='font-semibold text-black'>Description - </span>{listing.description}</p>
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
                                                    <FaWifi className='text-md'/>
                                                    <p>WiFi Available</p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <BiWifiOff className='text-md' />
                                                    <p>No WiFi</p>
                                                </div>
                                            )}
                                        </li>
                                        <li className='flex items-center gap-1 whitespace-nowrap'>
                                            {listing.distance ? (
                                                <div className="flex items-center gap-3">
                                                    <FaRoad className='text-md'/>
                                                    <p>{listing.distance}</p>
                                                </div>
                                            ) : null}
                                        </li>
                                        <li className='flex items-center gap-1 whitespace-nowrap'>
                                            {listing.duration ? (
                                                <div className="flex items-center gap-3">
                                                    <MdTimer className='text-md'/>
                                                    <p>{listing.duration}</p>
                                                </div>
                                            ) : null}
                                        </li>
                                    </ul>
                                    {currentUser && listing.userRef !== currentUser._id && !contact && (
                                        <button onClick={() => setContact(true)} className='px-7 py-3 bg-slate-700 text-white font-medium text-sm uppercase rounded shadow-md hover:opacity-95 hover:shadow-lg w-full text-center transition duration-150 ease-in-out mt-4 ' >Contact Landlord</button>
                                    )}
                                    {contact &&  <Contact listing={listing} currentUser={currentUser}/>}
                                </div>
                                <div className={`${listing.lat && listing.lng && isLoaded ? 'w-11/12 h-[200px] md:h-[350px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2' : ''}`}>
                                    {listing.lat && listing.lng && isLoaded ? (
                                        <GoogleMap
                                            zoom={15}
                                            mapContainerStyle={{ width: '100%', height: '100%' }}
                                            center={{ lat: listing.lat, lng: listing.lng }}
                                        >
                                            <Marker position={{ lat: listing.lat, lng: listing.lng }} />
                                        </GoogleMap>
                                    ) : listing.lat && listing.lng ? (
                                        <p>Loading map...</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                </>
            )}
        </main>
    )
}

export default Listing