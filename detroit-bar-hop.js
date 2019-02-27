// detroit-bar-hop.js

var request = require("request");
var yelpDetails;
var say;

  
  function getData() {
      // Setting URL and headers for request
      var options = {
         host: 'api.yelp.com',
         path: '/v3/businesses/search?location=detroit&categories=bars||lounge&open_now=true&radius=4828',
         json: true,
         headers: {
           'Authorization': 'Bearer X'
         }
      };
      // Return new promise
      return new Promise((resolve, reject) => {
        const https = require("https");
          // Do async job
          const request = https.get(options, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
              reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
  
              const body = [];
              // on every content chunk, push it to the data array
              response.on('data', (chunk) => body.push(chunk));
              // we are done, resolve promise with those joined chunks
              response.on('end', () => resolve(body.join('')));
          });
          request.on('error', (err) => reject(err))
      })
  }
  
  var errHandler = function(err) {
      console.log(err);
  }
  
  exports.getRandomBar = function(){
      var dataPromise = getData();
      // Get user details after that get followers from URL
      dataPromise.then(JSON.parse, errHandler)
                 .then(function(result) {
                      yelpDetails = result;
                      // Do one more async operation here
                      var anotherPromise = getData().then(JSON.parse);
                      return anotherPromise;
                  }, errHandler)
                  .then(function(info) {
                    const randomBar = Math.floor(Math.random() * Math.floor(info.businesses.length));
                    const barData = info.businesses[randomBar];
  
                    const barName = barData.name;
                    const barRating = barData.rating;
                    const barAddress = barData.location.address1;
                    const barReviewCount = barData.review_count;
                    const barCostSymbol = barData.price;
                    var barCostConvert = null;
  
                    switch(barCostSymbol) {
                      case '$':
                        barCostConvert = "cheap"
                        break;
                      case '$$':
                        barCostConvert = "moderately priced"
                        break;
                      case '$$$':
                        barCostConvert = "a bit pricey"
                        break;
                      case '$$$$':
                        barCostConvert = "very expensive"
                        break;
                    }
                    say=(barName + ", located at " + barAddress + ". It has a rating of " +
                    barRating + " with a total of " + barReviewCount + " reviews. The menu is " +
                    barCostConvert + ".");
                    console.log(say);
                    return say;
                  }, errHandler);
                  return say;
  }

