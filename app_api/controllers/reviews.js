var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}

var getAuthor = function(req, res, callback) {
    if(req.payload && req.payload.email) {
        User.findOne({email: req.payload.email}).exec(function(err, user) {
            if (!user) {
                sendJSONresponse(res, 404, {
                    "message": "User not found"
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 404,err);
                return;
            }
            callback(req, res, user.name);
        });
    } else {
        sendJSONresponse(res, 404, {
            "message": "User not found"
        });
        return;
    }
};

module.exports.reviewCreate = function (req, res) {
    getAuthor(req, res, function (req, res, username) {
        if (req.params && req.params.locationId) {
            Loc.findById(req.params.locationId).exec(function (error, location) {
                if (!location) {
                    sendJsonResponse(res, 404, {
                        'message': 'locationId not found!'
                    });
                } else if (error) {
                    sendJsonResponse(res, 400, error);
                } else {
                    addReview(req, res, location, username);
                }
            })
        } else {
            sendJsonResponse(res, 404, {
                'message': 'Location id required'
            });
        }
    });

};

module.exports.reviewReadOne = function(req, res) {
    if(req.params && req.params.locationId && req.params.reviewId) {
        Loc
            .findById(req.params.locationId)
            .exec(
                function(error, location) {
                    var response, review;
                    if(!location) {
                        sendJsonResponse(res, 404, {'message': 'locationId not found!'});
                        return;
                    }
                    else if(error) {
                        sendJsonResponse(res, 404, error);
                        return;
                    }
                    if(location.reviews && location.reviews.length > 0) {
                        review = location.reviews.id(req.params.reviewId);
                        if(!review) {
                            sendJsonResponse(res, 404, {'message': 'reviewId not found!'});
                        }
                        else {
                            response = {
                                location : {
                                    name: location.name,
                                    id: req.params.locationId
                                },
                                review : review
                            };
                            sendJsonResponse(res, 200, response);
                        }
                    }
                    else {
                        sendJsonResponse(res, 404, {'message': 'No reviews found!'});
                    }
                });
    }
    else {
        sendJsonResponse(res, 404, {'message': 'Not found, locationId and reviewId required'});
    }
};

module.exports.reviewUpdateOne = function(req, res) {
    if(req.params && req.params.locationId && req.params.reviewId) {
       Loc.findById(req.params.locationId).select('reviews').exec(function(error, location) {
           if(!location) {
               sendJsonResponse(res, 404, {'message': 'Location not found'});
               return;
           }
           else if(error) {
               sendJsonResponse(res, 400, error);
               return;
           }
           if(location.reviews && location.reviews.length > 0) {
               var thisReview = location.reviews.id(req.params.reviewId);
               
               if(!thisReview) {
                   sendJsonResponse(res, 404, {'message': 'review not found'});
               } else {
                   thisReview.author = req.body.author;
                   thisReview.rating = req.body.rating;
                   thisReview.reviewText = req.body.reviewText;
                   
                   location.save(function(error, location) {
                       if(error) {
                           sendJsonResponse(res, 400, error);
                       } else {
                           updateAverageRating(location._id);
                           sendJsonResponse(res, 200, thisReview);
                       }
                   });
               }
           } else {
               sendJsonResponse(res, 404, {'message': 'No review to update!'});
           }
       }); 
    } else {
        sendJsonResponse(res, 404, {'message': 'locationId and reviewId required!'});
    }
}

module.exports.reviewDeleteOne = function(req, res) {
    if(req.params && req.params.locationId && req.params.reviewId) {
        Loc.findById(req.params.locationId).select('reviews').exec(function(error, location){
           if(!location) {
               sendJsonResponse(res, 404, {'status': 'Location not found'});
               return;
           } else if(error) {
               sendJsonResponse(res, 400, error);
               return;
           }
            
            if(location.reviews && location.reviews.length > 0) {
                if(!location.reviews.id(req.params.reviewId)) {
                    sendJsonResponse(res, 400, {'message': 'reviews not found!'});
                } else {
                    location.reviews.id(req.params.reviewId).remove();
                    location.save(function(error) {
                        if(error) {
                            sendJsonResponse(res, 400, error);
                        } else {
                            updateAverageRating(location._id);
                            sendJsonResponse(res, 204, null);
                        }
                    });
                }
            } else {
                sendJsonResponse(res, 404, {'message': 'No reviews to delete.'});
            }
        });
    }
}

var addReview = function(req, res, location, author) {
    location.reviews.push({
        author: author,
        rating: req.body.rating,
        reviewText: req.body.reviewText
    });
    console.log('location : ', location);
    location.save(function(error, location) {
        var thisReview;
        if(error) {
            console.log('error in saving review ---->', error);
            sendJsonResponse(res, 400, error);
        }
        else {
            updateAverageRating(location._id);
            thisReview = location.reviews[location.reviews.length - 1];
            sendJsonResponse(res, 201, thisReview);
        }
    });
};

var updateAverageRating = function(locationId) {
    Loc.findById(locationId).exec(function(error, location) {
        if(!error) {
            calculateAverageRating(location);
        }
    });
};

var calculateAverageRating = function(location) {
    var i, reviewCount, averageRating, totalRating;
    
    if(location.reviews && location.reviews.length) {
        totalRating = 0;
        reviewCount = location.reviews.length;

        for(i=0; i<reviewCount; i++) {
            totalRating+= location.reviews[i].rating;     
        }
        
        averageRating = parseFloat(totalRating/reviewCount);
        location.rating = averageRating;
        
        location.save(function(error) {
            if(error) {
                console.log(error);
            }
            else {
                console.log('Average rating updated to', averageRating);
            }
        })
    }
};