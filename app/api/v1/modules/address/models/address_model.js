'use strict'

const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
    {
        address: { type: String, default: null },
        type: { type: String, default: null },
        createdby_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Address = mongoose.model("address", addressSchema);
module.exports = Address;



