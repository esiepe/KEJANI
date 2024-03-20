import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        lat: {
            type: Number,
            required: false,
        },
        lng: {
            type: Number,
            required: false,
        },
        distance:{
            type: String,
            required: false,
        },
        duration:{
            type: String,
            required: false,
        },
        size: {
            type: String,
            required: true,
        },
        indoorPlumbing: {
            type: Boolean,
            required: true,
        },
        wifi: {
            type: Boolean,
            required: true,
        },
        rent: {
            type: Number,
            required: true,
        },
        units: {
            type: Number,
            required: true,
        },
        imageUrls: {
            type: Array,
            required: true,
        },
        userRef: {
            type: String,
            required: true,
        },

    }, {timestamps: true}
)

const Listing = mongoose.model("Listing", listingSchema)

export default Listing