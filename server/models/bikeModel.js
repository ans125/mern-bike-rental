import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    name: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },

    comment: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
);

const bikeSchema = mongoose.Schema(
{
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    name: {
        type: String,
        required: true
    },

    brand: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    rentPerDay: {
        type: Number,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    // Engine class used for browsing, e.g. "70cc", "125cc", "Sports & Heavy"
    category: {
        type: String,
        default: ""
    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    rating: {
        type: Number,
        default: 0
    },

    numReviews: {
        type: Number,
        default: 0
    },

    reviews: [reviewSchema]

},
{
    timestamps: true
}
);

// const Bike = mongoose.model("Bike", bikeSchema);
const Bike = mongoose.models.Bike || mongoose.model("Bike", bikeSchema);

export default Bike;