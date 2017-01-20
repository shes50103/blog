var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

exports.list = function(req, res, next){
  Photo.find({}, function(err, photos){
    if (err) return next(err);
    res.render('download', {
      title: 'Photos',
      photos: photos,
	  user: req.session.user,
	  username: req.session.user.name,
	  success: req.flash('success').toString(),
	  error: req.flash('error').toString()
    });
  });
};


exports.upload = function(req, res){
    var img = req.files.photo;
    var name = img.name;
    var path = img.path;
    fs.rename(img.path, path, function(err){
      if (err) {
		  return next(err);}
      Photo.create({
        name: name,
        path: img.name
      }, function(err) {
        if (err){ 
		return next(err);}
        req.flash('success', '上傳成功!');
        res.redirect('/download');
      });
    });
};

exports.remove = function(dir){
  return function(req, res, next){
	var id = req.params.id;
	Photo.findById(id, function(err, photo){
	  var path = join(dir, photo.path);
	  fs.unlink(path, function(err){if (err) return next(err);}); 
	  photo.remove();
	  res.redirect('/download');
	 });
  };
};


exports.download = function(dir){
  return function(req, res, next){
    var id = req.params.id;
    Photo.findById(id, function(err, photo){
      if (err) return next(err);
      var path = join(dir, photo.path);
	  var buf0=new Buffer(photo.name);//不知道為什麼?
	  res.download(path,buf0.toString('binary'));
    });
  };
};



exports.see = function(dir){
  return function(req, res, next){
    var id = req.params.id;
    Photo.findById(id, function(err, photo){
      if (err) return next(err);
      var path = join(dir, photo.path);
      res.sendfile(path);
    });
  };
};


/*
exports.list = function(req, res){ res.render('download', {
  title: 'Photos',
  photos: photos,
  user: req.session.user,
  success: req.flash('success').toString(),
  error: req.flash('error').toString()
  });
};
*/


/*

exports.remove = function(dir){
  return function(req, res, next){
	var id = req.params.id;
		  Photo.findById(id, function(err, photo){
			var path = join(dir, photo.path);
			fs.unlink(path, function(err){
			if (err) return next(err);
			});
			  
			  
		  photo.remove();
		  res.redirect('/download');
	    });
  };
};


exports.download = function(dir){
  return function(req, res, next){
    var id = req.params.id;
    Photo.findById(id, function(err, photo){
      if (err) return next(err);
      var path = join(dir, photo.path);
      //res.sendfile(path);
	  console.log('Name:'+photo.name);
	  console.log('Path:'+path)
	  var buf0=new Buffer(photo.name);//不知道為什麼?
	  res.download(path,buf0.toString('binary'));
    });
  };
};



exports.see = function(dir){
  return function(req, res, next){
	  console.log('-----------0');
	  console.log(req.params);
	  console.log(req.params.id);
    var id = req.params.id;
    Photo.findById(id, function(err, photo){
      if (err) return next(err);
      var path = join(dir, photo.path);
      res.sendfile(path);
	  console.log('Name:'+photo.name);
	  console.log('Path:'+path)
    });
  };
};


*/