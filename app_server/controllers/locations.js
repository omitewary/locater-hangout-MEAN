var request = require('request');
var apiOptions = {
    server: 'http://localhost:3000'
};
console.log('env', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = process.env.MONGOLAB_URI;
}
/*GET 'home' page*/
module.exports.homeList = function (req, res) {
    /*var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url: apiOptions.server + path,
        mehtod: 'GET',
        json: {},
        qs: {
            lng: 72.8249342,
            lat: 18.935197,
            maxDistance: 5000
        }
    };

    request(requestOptions, function (err, response, body) {
        var i, data;
        data = body;
        if (response.statusCode === 200 && data.length) {
            for (i = 0; i < data.length; i++) {
                data[i].distance = _formatDistance(data[i].distance);
            }
        }*/
        renderHomepage(req, res);
    //});
}

/*GET 'location Info' page*/
module.exports.locationInfo = function (req, res) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};

/*GET review page*/
module.exports.addReview = function (req, res) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
}

module.exports.doAddReview = function (req, res) {
    var requestOptions, path, locationId;
    locationId = req.params.locationId
    path = '/api/locations/' + locationId + '/review';
    var postData = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };

    requestOptions = {
        url: apiOptions.server + path,
        method: 'POST',
        json: postData
    };

    if (!postData.author || !postData.rating || !postData.reviewText) {
        res.redirect('/location/' + locationId + '/review/new?err=val');
    } else {
        request(requestOptions, function (err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/location/' + locationId);
            } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError') {
                res.redirect('/location/' + locationId + '/review/new?err=val');
            } else {
                _showError(req, res, response.statusCode);
            }
        });
    }
}

var getLocationInfo = function (req, res, callback) {
    var requestOptions, path;
    path = '/api/locations/' + req.params.locationId;

    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {}
    };

    request(requestOptions, function (err, response, body) {
        var data = body;
        if (response.statusCode === 200) {
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            }
            callback(req, res, body);
        } else {
            _showError(req, res, response.statusCode);
        }
    });
}

var renderHomepage = function (req, res) {
    /*var message;
    if (!(responseBody instanceof Array)) {
        console.log('fail');
        message = 'API look up error';
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = 'No places found near by!';
        }
    }*/
    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: 'Loc8r helps you find places to work when out and about.'
        //locations: responseBody,
        //message: message
    });
};

/*Get location detail page*/
var renderDetailPage = function (req, res, locDetail) {
    console.log('locDetail', locDetail);
    res.render('location-info', {
        title: locDetail.name,
        pageHeader: {
            title: locDetail.name
        },
        sidebar: {
            context: locDetail.name + ' is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: locDetail
    });
};

/*Get add review page*/
var renderReviewForm = function (req, res, locDetail) {
    res.render('location-review-form', {
        title: 'Review',
        pageHeader: {
            title: 'Review ' + locDetail.name
        },
        error: req.query.err
    });
}

var _formatDistance = function (distance) {
    if (distance > 1) {
        numDistance = parseFloat(distance.toFixed(1));
        unit = ' km';
    } else {
        numDistance = parseInt(distance * 1000, 10);
        unit = ' m'
    }
    return numDistance + unit;
};

var _showError = function (req, res, status) {
    var title, content;
    if (status === 404) {
        title = '404, Page not found';
        content = 'Oh dear! looks like we cannot find the page. Sorry.';
    } else {
        title = status;
        content = 'Something went wrong!';
    }
    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content
    });
};