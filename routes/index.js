var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
var times = [];
var deduplication = require('../modle/deduplication');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/deduplication',function(req,res,next){
  if(req.query.tablename==undefined){
    return req.json({error:'参数异常'})
  }
  var tablename = req.query.tablename;
  rule.second = times;
  for (var i = 0; i < 60; i = i + 2) {
    times.push(i);
  }
  schedule.scheduleJob(rule, function () {
    var updateTag = deduplication.UpdateTag(tablename);
    if(updateTag){
      this.cancel();
      console.log("-------------------------the end---------------------------")
    }
  });
  res.json({success:"12312"});

});
module.exports = router;
