import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import { FaWifi, FaFaucetDrip, FaFaucet } from 'react-icons/fa6'
import { BiWifiOff } from 'react-icons/bi'

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageUrls[0]} alt="listing cover"
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className='truncate text-lg font-semibold text-slate-700 mt-2'>{listing.name}</p>
          <div className="flex items-center gap-1">
            <MdLocationOn className='h-4 w-4 text-green-700'/>
            <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
          <p>
            <span className="font-semibold text-gray-500 mt-2">KES {listing.rent}/month</span>
          </p>
          <div className="flex gap-8">
            <div className="">
              {listing.wifi ? (
                    <div className='flex items-center gap-3'>
                        <FaWifi className='h-4 w-4 text-green-700'/>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <BiWifiOff className='h-4 w-4 text-green-700' />
                    </div>
                )}
            </div>
            <div className="">
            {listing.indoorPlumbing ? (
              <div className='flex items-center gap-3'>
                  <FaFaucetDrip className='h-4 w-4 text-green-700'/>
              </div>   
            ) : (
              <>
                  <FaFaucet className='h-4 w-4 text-green-700'/>
              </>
            )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
