/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * delete.js (OrmDelete)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

 const OrmSqlBuilder = require("./sqlBuilder.js");
 const DateFormat = require("./dateFormat.js");
 const sync = require("./sync.js");
 const OrmCallback = require("./callback.js");

const OrmDelete = function(topContext,baseObj,selectObj,saveObj){

    var sqlBuilder = new OrmSqlBuilder(topContext);

    /**
     * where
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} index 
     * @param {*} logicalOperand 
     * @returns 
     */
    this.where = function(field,operand,value,index,logicalOperand){
        sqlBuilder.where(field,operand,value,index,logicalOperand);
        return this;
    };

    /**
     * whereAnd
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} index 
     * @returns 
     */
    this.whereAnd = function(field,operand,value,index){
        sqlBuilder.whereAnd(field,operand,value,index);
        return this;
    };
    
    /**
     * whereOr
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} index 
     * @returns 
     */
    this.whereOr = function(field,operand,value,index){
        sqlBuilder.whereOr(field,operand,value,index);
        return this;
    };

    /**
     * delete
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     */
    this.delete=function(params,option,callback){

        if(!option){
            option={};
        }

        var physical=false;
        if(option.physical){
            physical=option.physical;
        }

        var responseStatus=false;
        if(option.response){
            responseStatus=option.response;
        }

        var logicalDeleteKey = topContext.getLogicalDeleteKey();

        var delType=0;

        if(logicalDeleteKey){
            if(!physical){
                delType=1;
            }
        }

        if(delType==0){
            return this.physicalDelete(params,option,callback);
        }
        else if(delType==1){
            return this.logicalDelete(params,option,callback);
        }

    };

    /**
     * physicalDelete
     * @param {*} params 
     * @param {*} callback 
     */
    this.physicalDelete = function(params,callback){

        var sql=this.physicalDeleteSql(params);

        if(!sql){
            return;
        }

        return baseObj.query(sql,null,callback);
    };

    /**
     * physicalDeleteSql
     * @param {*} params 
     * @returns 
     */
    this.physicalDeleteSql=function(params){

        var surrogateKey=topContext.checkSurrogateKey();

        if(surrogateKey){
            if(params){

                if(typeof params === "string" || typeof params === "number"){
                    params=[params];
                }
    
                this.where(surrogateKey,"IN",params);
            }
        }
    
        var sql = sqlBuilder.build.physicalDelete();
        return sql;
    };

    /**
     * logicalDelete
     * @param {*} params 
     * @param {*} callback 
     */
    this.logicalDelete=function(params,callback){

        var sql=this.logicalDeleteSql(params);

        if(!sql){
            return;
        }

        return baseObj.query(sql,null,callback);
    };

    /**
     * logicalDeleteSql
     * @param {*} params 
     * @returns 
     */
    this.logicalDeleteSql=function(params){

        var surrogateKey=topContext.checkSurrogateKey();

        var logicalDeleteKey = topContext.getLogicalDeleteKey();

        var timeStamp = topContext.getTimeStamp();

        if(!logicalDeleteKey){
            return;
        }

        var onValue=1;
        if(logicalDeleteKey){
            if(logicalDeleteKey.type=="date"){
                onValue=DateFormat(null,"Y-m-d");
            }
            else if(logicalDeleteKey.type=="datetime"){
                onValue=DateFormat(null,"Y-m-d H:i:s");
            }    
        }

        if(surrogateKey){
            
            if(params){
                if(typeof params === "string" || typeof params === "number"){
                    params=[params];
                }
                this.where(surrogateKey,"IN",params);
            }

        }

        var updateData={
            [logicalDeleteKey.field]:onValue,
        };  

        if(timeStamp){
            if(timeStamp.modified){
                updateData[timeStamp.modified]=DateFormat(null,"Y-m-d H:i:s");
            }
        }

        var sql = sqlBuilder.build.logicalDelete(updateData);

        return sql;
    };

    /**
     * revert
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     */
    this.revert=function(params,callback){

        var sql=this.revertSql(params);

        if(!sql){
            return;
        }

        return baseObj.query(sql,null,callback);
    };


    this.revertSql=function(params){

        var surrogateKey=topContext.checkSurrogateKey();

        var logicalDeleteKey = topContext.getLogicalDeleteKey();

        var timeStamp = topContext.getTimeStamp();

        if(!logicalDeleteKey){
            return;
        }

        var onValue=0;
        if(logicalDeleteKey){
            if(logicalDeleteKey.type=="date"){
                onValue=null;
            }
            else if(logicalDeleteKey.type=="datetime"){
                onValue=null;
            }    
        }

        if(surrogateKey){
            if(params){

                if(typeof params === "string" || typeof params === "number"){
                    params=[params];
                }

                this.where(surrogateKey,"IN",params);
            }

        }

        var updateData={
            [logicalDeleteKey.field]:onValue,
        };  

        if(timeStamp){
            if(timeStamp.modified){
                updateData[timeStamp.modified]=DateFormat(null,"Y-m-d H:i:s");
            }
        }

        var sql = sqlBuilder.build.logicalDelete(updateData);

        return sql;
    };

};
module.exports = OrmDelete;