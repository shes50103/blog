var User = require('../models/user.js');
var	Club = require('../models/club.js');

//club
exports.get_club = function (req, res) {
    Club.search(req.query.keyword, function (err, club) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/club');
      }
      res.render('clubs', {
        title: '社團',
	    club: club,
	    username: req.session.user.name,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  };
exports.post_club = function (req, res) {
    var currentUser = req.session.user,
        club = new Club({
        name: req.body.clubname,
        administrator: req.session.user.name
    });

    club.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/club');
      }
      req.flash('success', '創建社團成功!');
      res.redirect('/club');//发表成功跳转到主页
    });
  };
  
//club_name

exports.get_club_name = function (req, res) {
    User.search(req.query.keyword, function (err, users) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      Club.get(req.params.name, function (err, club) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/club');
      }
	  if (!club) {
        req.flash('error', '用户不存在!'); 
        return res.redirect('/club');
      }
      res.render('club', {
        title: '社團',
	    club: club,
		users: users,
		club_posts: club.posts,
	    username: req.session.user.name,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
    });
  };
exports.post_club_name =function (req, res) {
    var currentUser = req.session.user.name;
    Club.addpost(req.params.name, currentUser, req.body.post,function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/club/:name');//出错！返回文章页
      }
	  req.flash('success', '留言成功');
      res.redirect('back');//成功！返回文章页
    });
  };

//club_member


exports.get_club_member = function (req, res) {
    User.search(req.query.keyword, function (err, users) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      Club.get(req.params.name, function (err, club) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/club');
      }
      res.render('club_member', {
        title: '社團',
	    club: club,
		users: users,
	    username: req.session.user.name,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
    });
  };
exports.post_club_member = function (req, res){
	var username = req.body.username;
		console.log('aaaaaaaaa');

	Club.addmember(req.params.name, username, function (err) {
      if (err) {
        req.flash('error', err); 
		console.log('bbbbbbbb');
        return res.redirect('back');
		
      }
	  console.log('cCCCCCCCCC');
	  req.flash('新增成功'); 
	  return res.redirect('back');
    });
  };




















