import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useJsApiLoader, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api"

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })
  const center = { lat: -0.1674, lng: 35.9649 }
  const [origin, setOrigin] = useState({...center});
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    lat: 0,
    lng: 0,
    distance: "",
    duration: "",
    size: "",
    indoorPlumbing: false,
    wifi: false,
    rent: 0,
    units: 1,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  console.log(formData);
  const handleMapClick = (e) => {
    const clickedLat = e.latLng.lat()
    const clickedLng = e.latLng.lng()
    const clickedLocation = {lat: clickedLat, lng: clickedLng}
    setOrigin({...clickedLocation})
    setFormData({...formData, lat: clickedLat, lng: clickedLng})
  }
  const calculateRoute = async () => {
    if(window.google) {
      const directionService = new window.google.maps.DirectionsService()
      const results = await directionService.route({
        origin: origin,
        destination: center,
        travelMode: window.google.maps.TravelMode.DRIVING,
      })
      console.log(results)
      if(results && results.routes.length > 0) {
        const route = results.routes[0]
        const distance = route.legs[0].distance.text
        const duration = route.legs[0].duration.text
        setFormData({...formData, distance: distance, duration: duration})
      }
    }
  }
  useEffect(() => {
    calculateRoute()
  }, [origin])
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2MB max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (
      e.target.id === "single-room" ||
      e.target.id === "double-room" ||
      e.target.id === "one-bedroom" ||
      e.target.id === "bedsitter" ||
      e.target.id === "two-bedroom"
    ) {
      setFormData({
        ...formData,
        size: e.target.id,
      });
    }
    if (e.target.id === "indoorPlumbing" || e.target.id === "wifi") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="textarea"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          { !isLoaded ? 
            <p>Loading map...</p> :
            <GoogleMap
              zoom={13}
              mapContainerStyle={{width: '100%', height: '300px'}}
              center={origin}
              onClick={handleMapClick}
              options={{
                mapTypeControl: false,
                streetViewControl: false,
              }}
            >
              <Marker position={origin}/>
            </GoogleMap>
          }
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="single-room"
                className="w-5"
                onChange={handleChange}
                checked={formData.size === "single-room"}
              />
              <span>Single Room</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="double-room"
                className="w-5"
                onChange={handleChange}
                checked={formData.size === "double-room"}
              />
              <span>Double Room</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bedsitter"
                className="w-5"
                onChange={handleChange}
                checked={formData.size === "bedsitter"}
              />
              <span>Bedsitter</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="one-bedroom"
                className="w-5"
                onChange={handleChange}
                checked={formData.size === "one-bedroom"}
              />
              <span>One Bedroom</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="two-bedroom"
                className="w-5"
                onChange={handleChange}
                checked={formData.size === "two-bedroom"}
              />
              <span>Two Bedrooms</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="indoorPlumbing"
                className="w-5"
                onChange={handleChange}
                checked={formData.indoorPlumbing}
              />
              <span>Indoor plumbing</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wifi"
                className="w-5"
                onChange={handleChange}
                checked={formData.wifi}
              />
              <span>Wi-Fi</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="units"
                min={1}
                max={50}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={+formData.units}
              />
              <p>Units</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="rent"
                min={1}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={+formData.rent}
              />
              <div className="flex flex-col item-center">
                <p>Rent</p>
                <span className="text-xs">(KES / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
