/*
var path = require('path');
var fs = require('fs');
var join = path.join;
*/
var User = require('../models/user.js');

//get friend
exports.addfriend_get1 = function (req, res, next){
	  User.get(req.session.user.name, function (err, user) {
      req.session.user = user;
	  console.log(req.session.user);
	  next();
    });
   };
   
   
exports.addfriend_get2 = function (req, res) {
    User.search(req.query.keyword, function (err, users) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('friend', {
        title: "Friend:" + req.query.keyword,
        users: users,//doc 出來的東西
        user: req.session.user,
		username: req.session.user.name,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
 };
 
//post friend
exports.addfriend_post0 = function (req, res, next) {
	var currentUser = req.session.user,
	username = req.body.username;
	User.addfriend0(currentUser.name, username, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/friend');//出错！返回文章页
      }
	  next();
    });
  };
  
  
exports.addfriend_post1 = function (req, res, next) {
	var currentUser = req.session.user,
	username = req.body.username;
	User.addfriend1(currentUser.name, username, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/friend');//出错！返回文章页
      }
	  next();
    });
  };
   
   
exports.addfriend_post2 = function (req, res) {
	var currentUser = req.session.user,
	username = req.body.username;
	User.addfriend2( currentUser.name, username,  function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/friend');//出错！返回文章页
      }
      req.flash('success', '送出邀請');
      res.redirect('/friend');//成功！返回文章页
    });
  };
  
  
//get friendship
exports.addfriendship_get1 = function (req, res, next){
	  User.get(req.session.user.name, function (err, user) {
      req.session.user = user;
	  console.log(req.session.user);
	  next();
    });
  };
   

exports.addfriendship_get3 = function (req, res, next) {
	var currentUser = req.session.user;
	User.delete_notice(currentUser.name, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/friend');//出错！返回文章页
      }
	  next();
    });
  };
  
  
exports.addfriendship_get2 = function (req, res) {
	User.search(req.query.keyword, function (err, users) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('friendship', {
        title: req.session.user.name+" Friendship:",
        users: users,
	    username: req.session.user.name,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  };
//post friendship




exports.addfriendship_post1 = function (req, res, next) {
	var currentUser = req.session.user,
	username = req.body.username;
	User.deletefriend(currentUser.name, username, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/friendship');//出错！返回文章页
      }
      next();
    });
};


exports.addfriendship_post2 = function (req, res) {
	var currentUser = req.session.user,
	username = req.body.username;
	User.deletefriend(username,currentUser.name,  function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/friendship');//出错！返回文章页
      }
      req.flash('success', '刪除好友');
      res.redirect('/friendship');//成功！返回文章页
    });
};










