import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}
export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'))
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only delete your own listings!'))
    } 
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing has been deleted!')
    } catch (error) {
        next(error)
    }
}
export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
        return next(errorHandler(404, 'Listing not found'))
    }
    if (req.user.id!== listing.userRef) {
        return next(errorHandler(401, 'You can only update your own listings!'))
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)
    }
}
export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'))
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}
export const getListings = async (req, res, next) => {
    try {
        
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0
        let wifi = req.query.wifi

        if (wifi === undefined || wifi === 'false') {
            wifi = { $in: [false, true] }
        }

        let indoorPlumbing = req.query.indoorPlumbing

        if (indoorPlumbing === undefined || indoorPlumbing === 'false') {
            indoorPlumbing = { $in: [false, true] }
        }

        let size = req.query.size

        if (size === undefined || size === 'false') {
            size = { $in: ['single-room', 'double-room', 'one-bedroom', 'bedsitter', 'two-bedroom'] }
        }

        const searchTerm = req.query.searchTerm || ''

        const sort = req.query.sort || 'createdAt'

        const order = req.query.order || 'desc'

        const listings = await Listing.find({
            $or: [
              { name: { $regex: searchTerm, $options: 'i' } },
              { address: { $regex: searchTerm, $options: 'i' } },
            ],
            wifi,
            indoorPlumbing,
            size,
          })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);
        return res.status(200).json(listings)

    } catch (error) {
        next(error)
    }
}