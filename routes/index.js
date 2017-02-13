var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
	Club = require('../models/club.js'),
    Comment = require('../models/comment.js'),
	//file = require("file.js"),
    photos = require('../routes/photos'),
    friends = require('../routes/friends'),
	accounts = require('../routes/accounts'),
	clubs = require('./clubs'),
	plays = require('./plays'),


	bodyParser = require('body-parser');
var sets = require('../routes/sets');

var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

module.exports = function(app) {
  app.get('/', function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    Post.getTen(null, page, function (err, posts, total) {
      if (err) {
        posts = [];
      } 
	  if(req.session.user){
      res.render('index', {
        title: '首頁',
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
		success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        user: req.session.user,
				username: req.session.user.name

      });}else{
		  res.render('index', {
        title: '首頁',
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
		success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        user: req.session.user
      });  
	  }
    });
  });

  
  
app.get('/play',plays.get_setting1, plays.get_setting2);

/*
~~~~~~~~~~~~~~~~~~~~~~~~~
setting
~~~~~~~~~~~~~~~~~~~~~~~~~
*/
 app.get('/setting',sets.get_setting1, sets.get_setting2);

 app.get('/setting/email_edit',sets.get_email_edit);
 app.post('/setting/email_edit',sets.post_email_edit);

 app.get('/setting/password_edit',sets.get_password_edit);
 app.post('/setting/password_edit',sets.post_password_edit);
  /*
  app.get('/download/:id/download', photos.download(app.get('photos')));
  app.get('/download/:id/remove', photos.remove(app.get('photos')));
  app.get('/download/:id/see', photos.see(app.get('photos')));
  app.post('/download',photos.upload);  
*/
/*
~~~~~~~~~~~~~~~~~~~~~~~~~
file
~~~~~~~~~~~~~~~~~~~~~~~~~
*/
  app.get('/download', photos.list);
  app.get('/download/:id/download', photos.download(app.get('photos')));
  app.get('/download/:id/remove', photos.remove(app.get('photos')));
  app.get('/download/:id/see', photos.see(app.get('photos')));
  app.post('/download',photos.upload);
/*
~~~~~~~~~~~~~~~~~~~~~~~~~
friend
~~~~~~~~~~~~~~~~~~~~~~~~~
*/
  app.get('/friend', friends.addfriend_get1,friends.addfriend_get2);
  app.post('/friend', checkLogin);  
  app.post('/friend', friends.addfriend_post0,friends.addfriend_post1,friends.addfriend_post2);

  app.get('/friendship', friends.addfriendship_get1, friends.addfriendship_get3, friends.addfriendship_get2);
  app.post('/friendship', checkLogin);
  app.post('/friendship', friends.addfriendship_post1, friends.addfriendship_post2);

/*
~~~~~~~~~~~~~~~~~~~~~~~~~
reg + log
~~~~~~~~~~~~~~~~~~~~~~~~~
*/

  app.get('/reg', checkNotLogin);
  app.get('/reg', accounts.get_reg);
  app.post('/reg', checkNotLogin);
  app.post('/reg', accounts.post_reg);

  app.get('/login', checkNotLogin);
  app.get('/login', accounts.get_login);
  app.post('/login', checkNotLogin);
  app.post('/login', accounts.post_login);
  
  app.get('/logout', checkLogin);
  app.get('/logout', accounts.get_logout);
  

/*
~~~~~~~~~~~~~~~~~~~~~~~~~
Club
~~~~~~~~~~~~~~~~~~~~~~~~~
*/

  app.get('/club', checkLogin);
  app.get('/club', clubs.get_club);

  app.post('/club', checkLogin);
  app.post('/club', clubs.post_club);
  
  app.get('/club/:name', checkLogin);
  app.get('/club/:name', clubs.get_club_name);
  
  app.post('/club/:name', checkLogin);
  app.post('/club/:name', clubs.post_club_name);

  app.get('/club/:name/club_member', checkLogin);
  app.get('/club/:name/club_member', clubs.get_club_member);
  
  app.post('/club/:name/club_member', checkLogin);
  app.post('/club/:name/club_member', clubs.post_club_member);
  

/*
~~~~~~~~~~~~~~~~~~~~~~~~~
post
~~~~~~~~~~~~~~~~~~~~~~~~~
*/
  
  
  app.get('/post', checkLogin);
  app.get('/post', function (req, res) {
    res.render('post', {
      title: '發表',
	  username: req.session.user.name,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/post', checkLogin);
  app.post('/post', function (req, res) {
    var currentUser = req.session.user,
        tags = [req.body.tag1, req.body.tag2, req.body.tag3],
        post = new Post(currentUser.name, currentUser.head, req.body.title, tags, req.body.post);
    post.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      req.flash('success', '發布成功!');
      res.redirect('/');//发表成功跳转到主页
    });
  });

/*
~~~~~~~~~~~~~~~~~~~~~~~~~
archive
~~~~~~~~~~~~~~~~~~~~~~~~~
*/

  app.get('/archive', function (req, res) {
    Post.getArchive(function (err, posts) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('archive', {
        title: '存檔',
        posts: posts,
        user: req.session.user,
				username: req.session.user.name,

        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/tags', function (req, res) {
    Post.getTags(function (err, posts) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('tags', {
        title: '標籤',
        posts: posts,
        user: req.session.user,
				username: req.session.user.name,

        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
  

  
 

  app.get('/tags/:tag', function (req, res) {
    Post.getTag(req.params.tag, function (err, posts) {
      if (err) {
        req.flash('error',err); 
        return res.redirect('/');
      }
      res.render('tag', {
        title: 'TAG:' + req.params.tag,
        posts: posts,
		username: req.session.user.name,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/links', function (req, res) {
	  console.log("ggggggggg");
	  console.log(req.session.user);
    res.render('links', {
      title: '連結',
	  username: req.session.user.name,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.get('/search', function (req, res) {
    Post.search(req.query.keyword, function (err, posts) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('search', {
        title: "SEARCH:" + req.query.keyword,
        posts: posts,
				username: req.session.user.name,

        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
 app.get('/u/:name', function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //检查用户是否存在
    User.get(req.params.name, function (err, user) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      if (!user) {
        req.flash('error', '用户不存在!'); 
        return res.redirect('/');
      }
      //查询并返回该用户第 page 页的 10 篇文章
      Post.getTen(user.name, page, function (err, posts, total) {
        if (err) {
          req.flash('error', err); 
          return res.redirect('/');
        }
        res.render('user', {
          title: user.name,
          posts: posts,
          page: page,
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

  app.get('/u/:name/:day/:title', function (req, res) {
    Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('article', {
        title: req.params.title,
        post: post,
        user: req.session.user,
				username: req.session.user.name,

        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.post('/u/:name/:day/:title', function (req, res) {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
               date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48"; 
    var comment = {
        name: req.body.name,
        head: head,
        email: req.body.email,
        website: req.body.website,
        time: time,
        content: req.body.content
    };
    var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
    newComment.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', '留言成功!');
      res.redirect('back');
    });
  });

  app.get('/edit/:name/:day/:title', checkLogin);
  app.get('/edit/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      res.render('edit', {
        title: '編輯',
        post: post,
        user: req.session.user,
				username: req.session.user.name,

        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.post('/edit/:name/:day/:title', checkLogin);
  app.post('/edit/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
      var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
      if (err) {
        req.flash('error', err); 
        return res.redirect(url);//出错！返回文章页
      }
      req.flash('success', '修改成功!');
      res.redirect(url);//成功！返回文章页
    });
  });
  
  

  app.get('/remove/:name/:day/:title', checkLogin);
  app.get('/remove/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', '删除成功!');
      res.redirect('/');
    });
  });

  app.get('/reprint/:name/:day/:title', checkLogin);
  app.get('/reprint/:name/:day/:title', function (req, res) {
    Post.edit(req.params.name, req.params.day, req.params.title, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      var currentUser = req.session.user,
          reprint_from = {name: post.name, day: post.time.day, title: post.title},
          reprint_to = {name: currentUser.name, head: currentUser.head};
      Post.reprint(reprint_from, reprint_to, function (err, post) {
        if (err) {
          req.flash('error', err); 
          return res.redirect('back');
        }
        req.flash('success', '轉載成功!');
        var url = encodeURI('/u/' + post.name + '/' + post.time.day + '/' + post.title);
        res.redirect(url);
      });
    });
  });

  app.use(function (req, res) {
    res.render("404");
  });

  function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登入!'); 
      return res.redirect('/login');
    }
    next();
  }

  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登入!'); 
      return res.redirect('back');//返回之前的页面
    }
    next();
  }
};
