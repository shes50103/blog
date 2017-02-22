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
	  console.log("aaaa");
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
			  res.render('setting', {
			  title: "Settings",
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

exports.get_email_edit = function (req, res) {
    res.render('email_edit', {
      title: '修改信箱',
      user: req.session.user,
	  username: req.session.user.name,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
};

exports.post_email_edit = function (req, res) {
	var currentUser = req.session.user,
	email = req.body.email;
	User.email_edit( currentUser.name, email,function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/setting');//出错！返回文章页
      }
      req.flash('success', '修改完成');
      res.redirect('/setting');//成功！返回文章页
    });
  };

exports.get_password_edit = function (req, res) {
    res.render('password_edit', {
      title: '修改密碼',
      user: req.session.user,
	  username: req.session.user.name,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
};

exports.post_password_edit = function (req, res) {
	var currentUser = req.session.user,
	//password_original = req.body.password_original,
	password = req.body.password,
	password_re = req.body['password-repeat'];
	
	var md5 = crypto.createHash('md5'),
        password_original = md5.update(req.body.password_original).digest('hex');
	
	
	if (password_original != req.session.user.password) {
      req.flash('error', '原始密碼輸入錯誤!'); 
      return res.redirect('/setting/password_edit');//返回主册页
    }
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      req.flash('error', '两次輸入的密碼不一致!'); 
      return res.redirect('/setting/password_edit');//返回主册页
    }
	
	var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
	User.password_edit( currentUser.name, password,function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/setting');//出错！返回文章页
      }
      req.flash('success', '修改完成');
      res.redirect('/setting');//成功！返回文章页
    });
  };






