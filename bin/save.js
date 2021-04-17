/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * save.js (OrmSave)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const OrmSqlBuilder = require("./sqlBuilder.js");
const sync = require("./sync.js");
const DateFormat = require("./dateFormat.js");
 
const OrmSave = function(topContent,baseObj,showObj,selectObj){

    var sqlBuilder = new OrmSqlBuilder(topContent);

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
     * auto
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     */
    this.auto=function(params, option, callback){

        var surrogateKey=topContent.checkSurrogateKey();

        if(!surrogateKey){
            return;
        }

        if(!params[surrogateKey]){
            this.insert(params,option,callback);
        }
        else{
            this.update(params,option,callback);
        }

    };

    /**
     * insert
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     */
    this.insert=function(params,option,callback){

        if(!option){
            option={};
        }

        var responseStatus=false;
        if(option.response){
            responseStatus=option.response;
        }

        var surrogateKey=topContent.checkSurrogateKey();

        var timeStamp=topContent.getTimeStamp();
        if(timeStamp){
            params[timeStamp.created] = DateFormat(null,"Y-m-d H:i:s");
            params[timeStamp.modified] = DateFormat(null,"Y-m-d H:i:s");
        }

        var sql=sqlBuilder.build.insert(params);
        
        var response={};

        sync([
            function(next){
                baseObj.query(sql,null,function(error,result){
                    
                    if(error){
                        callback(error,null);
                        return;
                    }

                    if(responseStatus && surrogateKey){
                        response=result;
                        next();
                    }
                    else{
                        callback(null,result);
                    }
                });
            },
            function(){

                selectObj
                    .where(surrogateKey,"=",response.insertId)
                    .first(function(error,result){
                        callback(error,result);
                    });
                ;

            },
        ])


    };

    /**
     * getInsertSql
     * @param {*} params 
     * @returns 
     */
    this.getInsertSql=function(params){
        return sqlBuilder.build.insert(params);
    }

    /**
     * update
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     */
    this.update=function(params,option,callback){

        if(!option){
            option={};
        }

        var responseStatus=false;
        if(option.response){
            responseStatus=option.response;
        }

        var surrogateOff=false;
        if(option.surrogateOff){
            surrogateOff=option.surrogateOff;
        }

        var surrogateKey=topContent.checkSurrogateKey();

        var timeStamp=topContent.getTimeStamp();
        if(timeStamp){
            params[timeStamp.modified] = DateFormat(null,"Y-m-d H:i:s");
        }

        if(!surrogateOff){
            if(surrogateKey){
                this.where(surrogateKey,"=",params[surrogateKey]);
            }    
        }

        var sql=sqlBuilder.build.update(params);

        var response={};

        sync([
            function(next){
                baseObj.query(sql,null,function(error,result){
                    
                    if(error){
                        callback(error,null);
                        return;
                    }

                    if(responseStatus && surrogateKey){
                        response=result;
                        next();
                    }
                    else{
                        callback(null,result);
                    }
                });
            },
            function(){
                selectObj
                    .where(surrogateKey,"=",params[surrogateKey])
                    .first(function(error,result){
                        callback(error,result);
                    });
                ;
            },
        ]);        

    };

    /**
     * getInsertSql
     * @param {*} params 
     * @returns 
     */
     this.getUpdateSql=function(params,option){
        if(!option){
            option={};
        }

        var responseStatus=false;
        if(option.response){
            responseStatus=option.responseStatus;
        }

        var surrogateOff=false;
        if(option.surrogateOff){
            surrogateOff=option.surrogateOff;
        }

        var surrogateKey=topContent.checkSurrogateKey();

        if(!surrogateOff){
            if(surrogateKey){
                this.where(surrogateKey,"=",params[surrogateKey]);
            }    
        }

        return sqlBuilder.build.update(params);
    }

};
module.exports = OrmSave;