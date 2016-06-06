/**
 * Created by deng on 16-6-6.
 */
var mysql = require('mysql');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'douyu',
    port: 3306
});
var start=1;
var isTagFinish=false;
/**
 * @return {boolean}
 */
exports.UpdateTag=function (tablename) {

    var limit_range = (start - 1) * 10 + ',' + 20;
    var userAddSql = 'SELECT * FROM '+tablename+' limit ' + limit_range + ';';
    conn.query(userAddSql, function (err, rows, fields) {
        if (err) {
            return console.log(err.message);
        }
        if (rows.length == 0) {
            return isTagFinish = true;
        }
        for (var i = 0; i < rows.length; i++) {
            myEvents.emit('geted', rows[i].tags);
        }
    });
    start = start + 1;
    if (isTagFinish) {
        isTagFinish = false;
        start = 1;
        return true;
    } else {
        return false;
    }

};
myEvents.on('geted',function(tags){
    var split = tags.split(',');
    for(var i=0; i<split.length;i++){
        var tag = split[i];
        myEvents.emit('insertTag',tag);
    }
});
myEvents.on('insertTag',function(tag){
    var sql='insert tags (tag) value (?)';
    var params=[tag];
    conn.query(sql,params,function(err,fleid){
        if(err){
            return console.log(err);
        }
    });
});