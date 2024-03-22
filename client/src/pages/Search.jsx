import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

export default function Search() {
  const navigate = useNavigate()
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    size: 'single-room',
    wifi: false,
    indoorPlumbing: false,
    sort: 'created_at',
    order: 'desc',
  })
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState([])
  console.log(listings)
  useEffect(() => {

    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    const sizeFromUrl = urlParams.get('size')
    const wifiFromUrl = urlParams.get('wifi')
    const indoorPlumbingFromUrl = urlParams.get('indoorPlumbing')
    const sortFromUrl = urlParams.get('sort')
    const orderFromUrl = urlParams.get('order')

    if(
      searchTermFromUrl ||
      sizeFromUrl ||
      wifiFromUrl ||
      indoorPlumbingFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        size: sizeFromUrl ||'single-room',
        wifi: wifiFromUrl === 'true' ? true : false,
        indoorPlumbing: indoorPlumbingFromUrl ==='true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      })
    }

    const fetchListings = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/listing/get?${searchQuery}`)
      const data = await res.json()
      setListings(data)
      setLoading(false)
    }
    fetchListings()
  },[location.search])

  const handleChange = (e) => {
    if (
      e.target.id === "single-room" ||
      e.target.id === "double-room" ||
      e.target.id === "one-bedroom" ||
      e.target.id === "bedsitter" ||
      e.target.id === "two-bedroom"
    ) {
      setSidebarData({...sidebarData, size: e.target.id})
    } 
    if(e.target.id === 'searchTerm') {
      setSidebarData({...sidebarData, searchTerm: e.target.value})
    }
    if(e.target.id === 'wifi' || e.target.id === 'indoorPlumbing') {
      setSidebarData({...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false})
    }
    if(e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at'
      const order = e.target.value.split('_')[1] || 'desc'
      setSidebarData({...sidebarData, sort, order})
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('size', sidebarData.size)
    urlParams.set('wifi', sidebarData.wifi)
    urlParams.set('indoorPlumbing', sidebarData.indoorPlumbing)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('order', sidebarData.order)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  return (
    <div className='flex flex-col md:flex-row '>
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className="flex items-center gap-2">
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input 
              type="text" 
              id="searchTerm" 
              placeholder='Search...' 
              className='border rounded-lg p-3 w-full'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className='font-semibold'>Size:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="single-room"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.size === "single-room"}
              />
              <span>Single Room</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="double-room"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.size === "double-room"}
              />
              <span>Double Room</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="bedsitter"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.size === "bedsitter"}
              />
              <span>Bedsitter</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="one-bedroom"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.size === "one-bedroom"}
              />
              <span>One Bedroom</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="two-bedroom"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.size === "two-bedroom"}
              />
              <span>Two Bedrooms</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className='font-semibold'>Amenities:</label>
            <div className="flex gap-2">
              <input 
                type="checkbox" 
                id="wifi" 
                className='w-5' 
                onChange={handleChange} 
                checked ={sidebarData.wifi}
              />
              <span>WiFi</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" 
                id="indoorPlumbing" 
                className='w-5' 
                onChange={handleChange}
                checked ={sidebarData.indoorPlumbing}
              />
              <span>Water</span>
            </div>
          </div> 
          <div className="flex items-center gap-2">
            <label className='font-semibold'>Sort:</label>
            <select 
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order' 
              className='border rounded-lg p-3'
            >
              <option value='rent_desc'>Price high to low</option>
              <option value='rent_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results
        </h1>
      <div className="p-7 flex flex-wrap gap-4">
        {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found</p>
        )}
        {loading && (
          <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
        )}
        {
          !loading && listings && listings.map((listing) => <ListingItem key={listing._id} listing={listing}/>)
        }
      </div>
      </div>
    </div>
  )
}
