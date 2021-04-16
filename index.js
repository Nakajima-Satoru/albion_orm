const ormBase = require("./base.js");
const OrmSelect = require("./select.js");
const {OrmSave = require("./save.js");
const OrmDelete = require("./delete.js");
const OrmMigration = require("./migration.js");
const OrmShow = require("./show.js");

const albionOrm=function(context){

    var _connection=null;
    var _baseObj=null;

    this.connection=function(params){
        if(params){
            _baseObj=null;
            _connection=params;
            return this;
        }
        else{
            return _connection;            
        }
    };

    this.setTable = function(tableName){
        context.table=tableName;
        return this;
    };

    this.check = function(){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        return _baseObj.check();
    };

    this.query = function(sql, bind, callback){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        return _baseObj.query(sql,bind, callback);
    };

    this.select = function(params,callback){
        if(!_baseObj){
            _baseObj=new OrmSelect(this);
        }
        if(params){
            _baseObj.select(params,callback);
        }
        else{
            return _baseObj;
        }
    };

    this.save = function(params,option,callback){
        if(!_baseObj){
            _baseObj=new OrmSave(this);
        }
        if(params){
            _baseObj.auto(params,option,callback);
        }
        else{
            return _baseObj;
        }
    };

    this.insert=function(params,option,callback){
        if(!_baseObj){
            _baseObj=new OrmSave(this);
        }
        if(params){
            _baseObj.insert(params,option,callback);
        }
        else{
            return _baseObj;
        }
    };

    this.update=function(params,option,callback){
        if(!_baseObj){
            _baseObj=new OrmSave(this);
        }
        if(params){
            _baseObj.update(params,option,callback);
        }
        else{
            return _baseObj;
        }
    };

    this.delete = function(params,callback){
        if(!_baseObj){
            _baseObj=new OrmDelete(this);
        }
        if(params){
            _baseObj.delete(params,option,callback);
        }
        else{
            return _baseObj;
        }
    };

    this.migration = function(){
        var obj = new OrmMigration(this);
        return obj;
    };

    this.show = function(){
        var obj = new OrmShow(this);
        return obj;
    };

};
module.exports=albionOrm;