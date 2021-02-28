const model = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const Notification = model.notification;
const {validationResult} = require('express-validator');

module.exports = {
    getNotification: async function (req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        try {
            let userId = req.body.userId;
            let notificationData = await Notification.find({deletedAt: 0, status: true, expiryDate: {'$gte': new Date()}, userId: userId});
            console.log({deletedAt: 0, status: true, expiryDate: {'$gte': new Date()}, userId: userId});
            console.log(notificationData);
            if (notificationData.length > 0) {
                return res.status(200).json({
                    data: notificationData,
                    status: 'success',
                    message: "Notification data found successfully!!"
                });
            } else {
                return res.status(400).json({
                    data: [],
                    status: 'error',
                    message: "No Data Found!!"
                });
            }
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                data: [],
                status: 'error',
                errors: [{
                        msg: "Internal server error"
                    }]
            });
        }
    }
}