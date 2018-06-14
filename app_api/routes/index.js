var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuth = require('../controllers/authentication');

//locations
router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationCreate);
router.get('/locations/:locationId', ctrlLocations.locationReadOne);
router.put('/locations/:locationId', ctrlLocations.locationUpdateOne);
router.delete('/locations/:locationId', ctrlLocations.locationDeleteOne);

//reviews
router.post('/locations/:locationId/review', auth, ctrlReviews.reviewCreate);
router.get('/locations/:locationId/reviews/:reviewId', ctrlReviews.reviewReadOne);
router.put('/locations/:locationId/reviews/:reviewId', auth, ctrlReviews.reviewUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId', auth, ctrlReviews.reviewDeleteOne);

//login
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;