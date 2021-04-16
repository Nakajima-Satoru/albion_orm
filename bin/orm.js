/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * orm.js (albionOrm)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const ormBase = require("./base.js");
const OrmSelect = require("./select.js");
const OrmSave = require("./save.js");
const OrmDelete = require("./delete.js");
const OrmMigration = require("./migration.js");
const OrmShow = require("./show.js");

const albionOrm=function(context){

    var _connection=null;
    var _baseObj=null;
    var _selectObj=null;
    var _saveObj=null;

    /**
     * connection
     * @param {*} params 
     * @returns 
     */
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

    /**
     * setTable
     * @param {*} tableName 
     * @returns 
     */
    this.setTable = function(tableName){
        context.table=tableName;
        return this;
    };

    /**
     * check
     * @returns 
     */
    this.check = function(){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        return _baseObj.check();
    };

    /**
     * query
     * @param {*} sql 
     * @param {*} bind 
     * @param {*} callback 
     * @returns 
     */
    this.query = function(sql, bind, callback){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        return _baseObj.query(sql,bind, callback);
    };

    /**
     * select
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
    this.select = function(params,callback){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        if(!_selectObj){
            _selectObj=new OrmSelect(context,_baseObj);
        }
        if(params){
            _selectObj.select(params,callback);
        }
        else{
            return _selectObj;
        }
    };

    /**
     * save
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     * @returns 
     */
    this.save = function(params,option,callback){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        if(!_selectObj){
            _selectObj=new OrmSelect(context,_baseObj);
        }
        if(!_saveObj){
            _saveObj=new OrmSave(context,_baseObj,_selectObj);
        }
        if(params){
            _saveObj.auto(params,option,callback);
        }
        else{
            return _saveObj;
        }
    };

    /**
     * insert
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     * @returns 
     */
    this.insert=function(params,option,callback){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        if(!_selectObj){
            _selectObj=new OrmSelect(context,_baseObj);
        }
        if(!_saveObj){
            _saveObj=new OrmSave(context,_baseObj,_selectObj);
        }

        if(params){
            _saveObj.insert(params,option,callback);
        }
        else{
            return _saveObj;
        }
    };

    /**
     * update
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     * @returns 
     */
    this.update=function(params,option,callback){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        if(!_selectObj){
            _selectObj=new OrmSelect(context,_baseObj);
        }
        if(!_saveObj){
            _saveObj=new OrmSave(context,_baseObj,_selectObj);
        }

        if(params){
            _saveObj.update(params,option,callback);
        }
        else{
            return _saveObj;
        }
    };

    /**
     * delete
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
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

    /**
     * migration
     */
    this.migration = function(){
        var obj = new OrmMigration(this);
        return obj;
    };

    /**
     * show
     * @returns 
     */
    this.show = function(){
        var obj = new OrmShow(this);
        return obj;
    };

};
module.exports=albionOrm;