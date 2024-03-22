import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper'
import ListingItem from '../components/ListingItem'

export default function Home() {
  const [listings, setListings] = useState([])
  SwiperCore.use([Navigation])
  console.log(listings);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=4')
        const data = await res.json()
        setListings(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchListings()
  }, [])
  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          home with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Kejani Estate is the best place to find your next perfect to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let&apos;s get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {
          listings && listings.length > 0 && (listings.map((listing) => (
            <SwiperSlide>
              <div 
                style={{background: `url(${listing.imageUrls[0]}) 
                center no-repeat`, 
                backgroundSize: 'cover'
                }} 
                className="h-[500px]" 
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
      {/* listing results */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          listings && listings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent listings</h2>
                <Link  className='text-sm text-blue-800 hover:underline' to={'/search'}>Show more listings</Link>
              </div>
            <div className="flex flex-wrap gap-4">
              {
                listings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
