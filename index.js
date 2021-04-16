const ormBase = require("./base.js");
const OrmSelect = require("./select.js");
const OrmSave = require("./save.js");
const OrmDelete = require("./delete.js");

const albionOrm=function(context){

    var _connection=null;

    this.connection=function(params){
        if(params){
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
        var obj=new ormBase(this);
        return obj.check();
    };

    this.query = function(sql, bind, callback){
        var obj=new ormBase(this);
        return obj.query(sql,bind, callback);
    };

    this.select = function(params){
        var obj = new OrmSelect(this);
        if(params){
            obj.select(params,callback);
        }
        else{
            return obj;
        }
    };

    this.save = function(params){
        var obj = new OrmSave(this);
        if(params){
            obj.auto(params,option,callback);
        }
        else{
            return obj;
        }
    };

    this.delete = function(params){
        var obj = new OrmDelete(this);
        if(params){
            obj.delete(params,option,callback);
        }
        else{
            return obj;
        }

    };
};
module.exports=albionOrm;