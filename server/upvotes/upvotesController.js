var Upvote = require('../db/configdb.js').UpVote;
var Q = require('q');
var request = require('request');

module.exports = {

  newUpvote: function(req, res, next) {
    console.log('here')
    var linkid = req.body.linkid;
    var userid = req.body.userid;

    var storeUpvote = Q.nbind(Upvote.create, Upvote); 
    var findUpvote = Q.nbind(Upvote.findOne, Upvote);

    findUpvote({linkid: linkid, userid: userid})
      .then(function (match) {
        if (match) {
          res.send(match);
        } else {
          var upvote = {
            userid: userid,
            linkid: linkid
          };
          return storeUpvote(upvote)
        }
      })
      .then(function(upvote) {
        console.log(upvote)
        res.json(upvote)
      })
      .fail(function (error) {
        next(error);
      }); 
  }     
}


console.log('sending upvote request');


// request({
//   'uri': 'http://localhost:3000/api/links/upvote',
//   // host: 'localhost',
//   // path: '/api/links/upvote',
//   // port: 3000, 
//   'method': 'POST',
//     'content-type': 'application/json',
//     body: JSON.stringify({
//       'link_id': '567465e8b20053553bc91b2f', 
//       'user_id': '56736861e52eecf55c15f782'
//     })
// }, function(err, response) {
//   console.log('received response', Object.keys(response))
//   console.log('err', err)
// })


var options = {
    host: 'localhost',
    port: 3000,
    path: '/api/links/upvote',
    method: 'POST'
};

request(options, function(err,response,body) {
  // console.log(response);
});

