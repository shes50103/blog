/*
var path = require('path');
var fs = require('fs');
var join = path.join;
*/
var User = require('../models/user.js');
var Post = require('../models/post.js');
var crypto = require('crypto');
//get friend

exports.get_setting1 = function (req, res, next){
	  User.get(req.session.user.name, function (err, user) {
      req.session.user = user;
	  console.log(req.session.user);
	  next();
	  });
   };
  
exports.get_setting2 = function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //检查用户是否存在
    User.get(req.session.user.name, function (err, user) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      if (!user) {
        req.flash('error', '用户不存在!'); 
        return res.redirect('/');
      }
      Post.getTen(user.name, page, function (err, posts, total) {
        if (err) {
          req.flash('error', err); 
          return res.redirect('/');
        }
		User.search(req.query.keyword, function (err, users) {
			  if (err) {
				req.flash('error', err); 
				return res.redirect('/');
			  }
			  res.render('play', {
			  title: "Play!!!",
			  posts: posts,
			  page: page,
			  users: users,
			  isFirstPage: (page - 1) == 0,
			  isLastPage: ((page - 1) * 10 + posts.length) == total,
			  user: req.session.user,
			  username: req.session.user.name,
			  success: req.flash('success').toString(),
			  error: req.flash('error').toString()
		  });
		});
      });
    }); 
};
