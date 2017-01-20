var mongodb = require('./db');
var crypto = require('crypto');

function Club(club) {
  this.name = club.name ;
  this.administrator = club.administrator ;
    this.member = club.member ;
};

module.exports = Club;
//存储用户信息
Club.prototype.save = function(callback) {
  var club = { 
  name: this.name,
  administrator: this.administrator
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('club', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(club, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);//成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};


//返回通过标题关键字查询的所有文章信息
Club.search = function(keyword, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('club', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var pattern = new RegExp(keyword, "i");
      collection.find({
        "name": pattern
      }).toArray(function (err, doc) {
        mongodb.close();
        if (err) {
         return callback(err);
        }
        callback(null, doc);
      });
    });
  });
};

//读取用户信息
Club.get = function(name, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('club', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name: name
      }, function (err, club) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null, club);//成功！返回查询的用户信息
      });
    });
  });
};



Club.addpost = function(name, username, post,callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
    db.collection('club', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "name": name ,
      }, {
        $push: {"posts": {"post_owner":username,"post_content":post}}
      },{multi:true}, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

Club.addmember = function(name, username, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 users 集合
	console.log('here!!');
    db.collection('club', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "name": name ,
      }, {
        $push: {"memberlists": {"memberlist":username}}
      },{multi:true}, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};


/*
//刪除好友
User.deletefriend = function(name, username, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "name": name,
      }, {
        $pull: {"friendlists": {"friendlist":username}}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
//删除一篇文章
User.remove = function(name, friend, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //查询要删除的文档
      collection.findOne({
        "name": name,
        "friend": friend,
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        //删除转载来的文章所在的文档
        collection.remove({
          "name": name,
          "friendlist": friend,
        }, {
          w: 1
        }, function (err) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(null);
        });
      });
    });
  });
};
*/


