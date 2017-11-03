var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var fs = require('fs');

var siteJSON = {}
var key = "sites";
siteJSON[key] =[]

/* GET home page. */
router.get('/', function(req, res, next) {
  siteURIList = []
  siteBioList = []
  for(var i = 0; i < siteJSON.sites.length; i++){
    siteURIList.push(siteJSON.sites[i].siteURI)
    siteBioList.push(siteJSON.sites[i].bio)
  }
  res.render('index', { title: 'Simple site generator!', siteNameArray: siteURIList, siteBioArray: siteBioList});
  for(var i = 0; i < siteJSON.sites.length; i++){
  }
});

router.get('/site/:siteURI', function(req, res, next) {
  var siteURIString = req.params.siteURI;
  var bioString = req.params.bio;
  var goodURL = false;


  console.log(JSON.stringify(siteJSON));
  for(var i = 0; i < siteJSON.sites.length; i++){
    console.log(siteJSON.sites[i].siteURI);
    if(siteJSON.sites[i].siteURI == siteURIString){
      res.render('site', {siteURI: siteJSON.sites[i].siteURI, bio: siteJSON.sites[i].bio});
      goodURL = true;
    }
  }
  if(goodURL == false){
    res.render('error', {message: req.params.siteURI + " is not a valid URI"});
  }

});

router.post('/site/submit', function(req, res, next) {
  var unusedURL = true;

  var siteURIString = req.body.siteURI;
  var bioString = req.body.bio;

  for(var i = 0; i < siteJSON.sites.length; i++){
    if(siteJSON.sites[i].siteURI == siteURIString){
      res.render('error', {message: req.body.siteURI + " is already being used as a URI"});
      unusedURL = false;
    }
  }
  if(unusedURL == true){
    var obj = {siteURI: siteURIString, bio: bioString};
    siteJSON[key].push(obj);
    res.redirect('/site/' + siteURIString);

  }
});

function appendObject(obj){
  var configFile = fs.readFileSync('siteInfo.json');
  var config = JSON.parse(configFile);
  config.push(obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync('siteInfo.json', configJSON);
}

module.exports = router;
