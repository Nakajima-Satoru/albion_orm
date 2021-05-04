/**
 * ==================================================
 * 
 * FW_DAGGER_ORM Ver 1.0.0
 * 
 * orm.js (daggerOrm)
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

const daggerOrm=function(context){

    if(!context){
        context=this;
        context.ro={};
    }

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
        if(context==undefined){
            context={};
        }
        context.table=tableName;
        return this;
    };

    /**
     * getTable
     * @returns 
     */
    this.getTable=function(){
        if(context==undefined){
            context={};
        }
        return context.table;
    }

    /**
     * setSurrogateKey
     * @param {*} field 
     */
    this.setSurrogateKey=function(field){
        if(context==undefined){
            context={};
        }
        context.surrogateKey=field;
        return this;
    }

    /**
     * setTimeStamp
     * @param {*} params 
     */
    this.setTimeStamp=function(params){
        if(context==undefined){
            context={};
        }
        context.timeStamp=params;
        return this;
    }

    /**
     * getTimeStamp
     * @returns 
     */
    this.getTimeStamp=function(){
        if(context==undefined){
            context={};
        }
        return context.timeStamp;
    }

    /**
     * setLogicalDeleteKey
     * @param {*} params 
     * @returns 
     */
    this.setLogicalDeleteKey=function(params){
        if(context==undefined){
            context={};
        }
        context.logicalDeleteKey=params;
        return this;
    };

    /**
     * getLogicalDeleteKey
     * @returns 
     */
    this.getLogicalDeleteKey=function(){
        if(context==undefined){
            context={};
        }
        return context.logicalDeleteKey;
    };

    /**
     * getLog
     * @returns 
     */
    this.getLog=function(){
        if(_baseObj){
            return _baseObj.getLog();
        }
        return null;
    };

    /**
     * check
     * @returns 
     */
    this.check = function(){
        if(!_baseObj){
            _baseObj=new ormBase(this,context);
        }
        return _baseObj.check();
    };

    /**
     * checkSurrogateKey
     * @param {*} field 
     */
     this.checkSurrogateKey=function(){
         if(context==undefined){
             context={};
         }
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
            _baseObj=new ormBase(this,context);
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
            _baseObj=new ormBase(this,context);
        }
        if(!_selectObj){
            _selectObj=new OrmSelect(context,_baseObj);
        }
        if(params){
            return _selectObj.select(params,callback);
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
            _baseObj=new ormBase(this,context);
        }
        if(!_showObj){
            return _showObj = new OrmShow(context,_baseObj);
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
            _baseObj=new ormBase(this,context);
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
            return _saveObj.auto(params,responseStatuis,callback);
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
            _baseObj=new ormBase(this,context);
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
            return _saveObj.insert(params,option,callback);
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
            _baseObj=new ormBase(this,context);
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
            return _saveObj.update(params,option,callback);
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
            _baseObj=new ormBase(this,context);
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
            return _deleteObj.delete(params,option,callback);
        }
        else{
            return _deleteObj;
        }
    };

    /**
     * physicalDelete
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
    this.physicalDelete=function(params,callback){
        if(!_baseObj){
            _baseObj=new ormBase(this,context);
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
        return _deleteObj.physicalDelete(params,callback);
    };

    /**
     * physicalDeleteSql
     * @param {*} params 
     * @returns 
     */
     this.physicalDeleteSql=function(params){
        if(!_baseObj){
            _baseObj=new ormBase(this,context);
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
        return _deleteObj.physicalDeleteSql(params);
    };

    /**
     * logicalDelete
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
    this.logicalDelete=function(params,callback){
        if(!_baseObj){
            _baseObj=new ormBase(this,context);
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
        return _deleteObj.logicalDelete(params,callback);
    };

    /**
     * logicalDeleteSql
     * @param {*} params
     * @returns 
     */
     this.logicalDeleteSql=function(params){
        if(!_baseObj){
            _baseObj=new ormBase(this,context);
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
        return _deleteObj.logicalDeleteSql(params);
    };

    /**
     * revert
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
    this.revert=function(params,callback){
        if(!_baseObj){
            _baseObj=new ormBase(this,context);
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
        return _deleteObj.revert(params,callback);
    };

    /**
     * revertSql
     * @param {*} params 
     * @returns 
     */
     this.revertSql=function(params){
        if(!_baseObj){
            _baseObj=new ormBase(this,context);
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
        return _deleteObj.revertSql(params);
    };

    /**
     * migration
     */
    this.migration = function(){
        if(!_baseObj){
            _baseObj=new ormBase(this,context);
        }
        var obj = new OrmMigration(_baseObj);
        return obj;
    };

    /**
     * transaction
     * @param {*} callback 
     * @param {*} errorCallback 
     * @returns 
     */
    this.transaction=function(callback,errorCallback){
        var obj=new Ormtransaction(this);
        if(callback){
            return obj.transam(callback,errorCallback);
        }
        else{
            return obj;
        }
    };

};
module.exports=daggerOrm;