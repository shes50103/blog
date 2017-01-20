var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
	Club = require('../models/club.js'),
    Comment = require('../models/comment.js'),
	file = require("file.js"),
    photos = require('../routes/photos'),
	bodyParser = require('body-parser');
	
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
	
  app.get('/download', photos.list);
  app.get('/download/:id/download', photos.download(app.get('photos')));
  app.get('/download/:id/remove', photos.remove(app.get('photos')));
  app.get('/download/:id/see', photos.see(app.get('photos')));
  app.post('/download',photos.upload);

  
  app.get('/reg', checkNotLogin);
  app.get('/reg', function (req, res) {
    res.render('reg', {
      title: '註冊',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/reg', checkNotLogin);
  app.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      req.flash('error', '两次輸入的密碼不一致!'); 
      return res.redirect('/reg');//返回主册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: req.body.name,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在 
    User.get(newUser.name, function (err, user) {
      if (user) {
        req.flash('error', '帳號已存在!');
        return res.redirect('/reg');//返回注册页
      }
      //如果不存在则新增用户
      newUser.save(function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');//注册失败返回主册页
        }
        req.session.user = user;//用户信息存入 session
        req.flash('success', '註冊成功!');
        res.redirect('/');//注册成功后返回主页
      });
    });
  });
  

  app.post('/login', checkNotLogin);
  app.post('/login', function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.name, function (err, user) {
      if (!user) {
        req.flash('error', '帳號不存在!'); 
        return res.redirect('/login');//用户不存在则跳转到登录页
      }
      //检查密码是否一致
      if (user.password != password) {
        req.flash('error', '密碼错误!'); 
        return res.redirect('/login');//密码错误则跳转到登录页
      }
      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      req.flash('success', '登入成功!');
      res.redirect('/');//登陆成功后跳转到主页
    });
  });


  app.get('/club/:name',function (req, res) {
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
  });
  
  app.get('/club/:name/club_member',function (req, res) {
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
  });
  
    app.get('/friend',function (req, res, next){
	  User.get(req.session.user.name, function (err, user) {
      req.session.user = user;
	  console.log(req.session.user);
	  next();
    });
  }, function (req, res) {
    User.search(req.query.keyword, function (err, users) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('friend', {
        title: "Friend:" + req.query.keyword,
        users: users,
        user: req.session.user,
		username: req.session.user.name,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
  
  
  app.post('/club/:name/club_member', function (req, res){
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
  });
  
  app.post('/friend', checkLogin);
  app.post('/friend',function (req, res, next) {
	var currentUser = req.session.user,
	username = req.body.username;
	User.addfriend(currentUser.name, username, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/friend');//出错！返回文章页
      }
	  next();
    });
  },function (req, res) {
	var currentUser = req.session.user,
	username = req.body.username;
	User.addfriend( username,currentUser.name, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/friend');//出错！返回文章页
      }
      req.flash('success', '送出邀請');
      res.redirect('/friend');//成功！返回文章页
    });
  });
  
  app.post('/club/:name', checkLogin);
  app.post('/club/:name', function (req, res) {
    var currentUser = req.session.user.name;
    Club.addpost(req.params.name, currentUser, req.body.post,function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/club/:name');//出错！返回文章页
      }
	  req.flash('success', '留言成功');
      res.redirect('back');//成功！返回文章页
    });
  });

  app.get('/login', checkNotLogin);
  app.get('/login', function (req, res) {
    res.render('login', {
      title: '登入',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    }); 
  });
  
  app.post('/club', checkLogin);
  app.post('/club', function (req, res) {
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
  });
  
  app.get('/club', checkLogin);
  app.get('/club', function (req, res) {
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
  });
  
  app.post('/friendship', checkLogin);
  app.post('/friendship',function (req, res) {
	var currentUser = req.session.user,
	username = req.body.username;
	User.deletefriend(currentUser.name, username, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/friendship');//出错！返回文章页
      }
      req.flash('success', '刪除好友');
      res.redirect('/friendship');//成功！返回文章页
    });
  });
  
  
  app.get('/friendship',function (req, res, next){
	  User.get(req.session.user.name, function (err, user) {
      req.session.user = user;
	  console.log(req.session.user);
	  next();
    });
  }, function (req, res) {
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
  });


  

  

  
 
  

  
  
  
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

  app.get('/logout', checkLogin);
  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');//登出成功后跳转到主页
  });



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
