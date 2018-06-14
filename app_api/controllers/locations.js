var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.locationCreate = function(req, res) {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        rating: req.body.rating,
        facilities: req.body.facilities.split(','),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [
            {
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1
            },
            {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2
            }
        ]
    }, function(error, location) {
        if(error) {
            sendJsonResponse(res, 400, error);
        }
        else {
            sendJsonResponse(res, 200, location);
        }
    });
};

module.exports.locationsListByDistance = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    console.log('lng : ',req.query.lng);
    console.log('lat : ',req.query.lat);
    var point = {
        type: "Point",
        coordinates: [lng,lat]
    };
    
    var geoOptions = {
        spherical: true,
        maxDistance: parseFloat(req.query.maxDistance),
        distanceMultiplier : 0.001,
        num: 10
    }
    
    if(!lng || !lat) {
        sendJsonResponse(res, 404, {"message": "lng and lat query parameters are required"});
        return;
    }
    
    Loc.geoNear(point, geoOptions, function(error, results, stats) {
        if(error) {
             sendJsonResponse(res, 404, error);
        return;
        }
        else {
            var locations = processLocationsListByDistanceResult(results);
            sendJsonResponse(res, 200, locations);
        }
    });
};

module.exports.locationReadOne = function(req, res) {
    if(req.params && req.params.locationId) {
        Loc.findById(req.params.locationId).exec(function(error, location) {
            if(!location) {//if location is not found by mongodb
                sendJsonResponse(res, 404, {'message': 'locationId not found!'});
                return;
            }
            else if (error) {
                sendJsonResponse(res, 404, error);
                return;
            }
            sendJsonResponse(res, 200, location)
        });
    }
    else {//if no location id in request
        sendJsonResponse(res, 404, {'message': 'No locationId in request'});
    }
};

module.exports.locationUpdateOne = function(req, res) {
    if (req.params && req.params.locationId) {
        Loc
            .findById(req.params.locationId)
            .select('-reviews -rating')
            .exec(function (error, location) {
                if (error) {
                    sendJsonResponse(res, 400, error);
                    return;
                } else if (!location) {
                    sendJsonResponse(res, 404, {
                        'message': 'location not found!'
                    });
                    return;
                } else {
                    location.name = req.body.name;
                    location.address = req.body.address;
                    location.facilities = req.body.facilities.split(',');
                    location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
                    location.openingTimes =  [
                        {
                            days: req.body.days1,
                            opening: req.body.opening1,
                            closing: req.body.closing1,
                            closed: req.body.closed1
                        },
                        {
                            days: req.body.days2,
                            opening: req.body.opening2,
                            closing: req.body.closing2,
                            closed: req.body.closed2
                        }
                    ];
                    location.save(function(error, location) {
                        if(error) {
                            sendJsonResponse(res, 404, error);
                        }
                        else {
                            sendJsonResponse(res, 200, location);
                        }
                    })
                }
            });
    }
};

module.exports.locationDeleteOne = function(req, res) {
    if(req.params && req.params.locationId) {
        Loc.findById(req.params.locationId).exec(function(error, location) {
            if(!location) {
                sendJsonResponse(res, 404, {'message': 'Location not found'});
                return;
            } else if(error) {
                sendJsonResponse(res, 400, error);
            } else {
                location.remove(function(error, location) {
                    sendJsonResponse(res, 204, 'location deleted.')
                });
            }
        });
    } else {
        sendJsonResponse(res, 404, {'message': 'location id is required!'});
    }
};

var processLocationsListByDistanceResult = function(results) {
    console.log('res',results);
    var locations = [];
    results.forEach(function(doc) {
        locations.push({
            distance: doc.dis,
            rating: doc.obj.rating,
            facilities: doc.obj.facilities,
            reviews: doc.obj.reviews,
            name: doc.obj.name,
            address: doc.obj.address,
            openingTimes: doc.obj.openingTimes,
            _id: doc.obj._id
        })
    });
    return locations;
}