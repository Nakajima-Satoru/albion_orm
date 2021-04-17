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
const Ormtransaction = require("./transaction.js");

const albionOrm=function(context){

    var _connection=null;
    var _baseObj=null;
    var _selectObj=null;
    var _showObj=null;
    var _saveObj=null;
    var _deleteObj=null;

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
     * setSurrogateKey
     * @param {*} field 
     */
    this.setSurrogateKey=function(field){
        context.surrogateKey=field;
        return this;
    }

    /**
     * setTimeStamp
     * @param {*} params 
     */
    this.setTimeStamp=function(params){
        context.timeStamp=params;
        return this;
    }

    /**
     * getTimeStamp
     * @returns 
     */
    this.getTimeStamp=function(){
        return context.timeStamp;
    }

    /**
     * setLogicalDeleteKey
     * @param {*} params 
     * @returns 
     */
    this.setLogicalDeleteKey=function(params){
        context.logicalDeleteKey=params;
        return this;
    };

    /**
     * getLogicalDeleteKey
     * @returns 
     */
    this.getLogicalDeleteKey=function(){
        return context.logicalDeleteKey;
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
     * checkSurrogateKey
     * @param {*} field 
     */
     this.checkSurrogateKey=function(){
         return context.surrogateKey;
    }

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
     * show
     * @returns 
     */
     this.show = function(){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        if(!_showObj){
            _showObj = new OrmShow(context,_baseObj);
        }
        return _showObj;
    };

    /**
     * save
     * @param {*} params 
     * @param {*} responseStatuis 
     * @param {*} callback 
     * @returns 
     */
    this.save = function(params,responseStatuis,callback){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        if(!_selectObj){
            _selectObj=new OrmSelect(context,_baseObj);
        }
        if(!_showObj){
            _showObj = new OrmShow(context,_baseObj);
        }
        if(!_saveObj){
            _saveObj=new OrmSave(context,_baseObj,_showObj,_selectObj);
        }
        if(params){
            _saveObj.auto(params,responseStatuis,callback);
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
        if(!_showObj){
            _showObj = new OrmShow(context,_baseObj);
        }
        if(!_saveObj){
            _saveObj=new OrmSave(context,_baseObj,_showObj,_selectObj);
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
        if(!_showObj){
            _showObj = new OrmShow(context,_baseObj);
        }
        if(!_saveObj){
            _saveObj=new OrmSave(context,_baseObj,_showObj,_selectObj);
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
     * @param {*} option 
     * @param {*} callback 
     * @returns 
     */
    this.delete = function(params,option,callback){
        if(!_baseObj){
            _baseObj=new ormBase(this);
        }
        if(!_selectObj){
            _selectObj=new OrmSelect(context,_baseObj);
        }
        if(!_showObj){
            _showObj = new OrmShow(context,_baseObj);
        }
        if(!_saveObj){
            _saveObj=new OrmSave(context,_baseObj,_showObj,_selectObj);
        }
        if(!_deleteObj){
            _deleteObj=new OrmDelete(context,_baseObj,_selectObj,_saveObj);
        }
        if(params){
            _deleteObj.delete(params,option,callback);
        }
        else{
            return _deleteObj;
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
     * transaction
     * @param {*} callback 
     * @param {*} errCallback 
     * @returns 
     */
    this.transaction=function(callback,errCallback){
        var obj=new Ormtransaction(context);
        if(callback){

        }
        else{
            return obj;
        }
    };

};
module.exports=albionOrm;