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
const OrmCallback = require("./callback.js");

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
            return this.insert(params,option,callback);
        }

        if(!params[surrogateKey]){
            return this.insert(params,option,callback);
        }
        else{
            return this.update(params,option,callback);
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

        if(topContent.saveBefore){
            var buffer=topContent.saveBefore("insert",params);
            if(buffer){
                params=buffer;
            }
        }

        var sql=sqlBuilder.build.insert(params);
        
        sqlBuilder.clearBuffer();

        var ormCallback = new OrmCallback();

        if(callback){
            ormCallback._callback=callback;
        }

        var response={};

        sync([
            function(next){
                baseObj.query(sql,null,function(res){
                    response=res;
                    next();
                });
            },
            function(){

                if(!response.status){
                    if(ormCallback._callbackError){
                        ormCallback._callbackError(response.error);
                    }


                    if(ormCallback._callback){
                        ormCallback._callback(response);
                    } 

                    return;
                }
                else{

                    if(!responseStatus){
                        if(surrogateKey){
                        
                            if(response.status){
                                if(ormCallback._callbackSuccess){
                                    ormCallback._callbackSuccess(response.result);
                                }    
                            }
    
                            if(ormCallback._callback){
                                ormCallback._callback(response);
                            } 
                            return;
                        }
                    }
    
                    selectObj
                        .where(surrogateKey,"=",response.result.insertId)
                        .first(function(res){

                            if(!res.status){
                                if(ormCallback._callbackError){
                                    ormCallback._callbackError(res.error);
                                }
                            }
                            else{
                                if(ormCallback._callbackSuccess){
                                    ormCallback._callbackSuccess(res.result);
                                }    
                            }
    
                            if(ormCallback._callback){
                                ormCallback._callback(res);
                            } 
                        });
                    ;

                }

            },
        ]);

        return ormCallback;
    };

    /**
     * getInsertSql
     * @param {*} params 
     * @returns 
     */
    this.getInsertSql=function(params){
        var str = sqlBuilder.build.insert(params);
        return str;
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
                var _sid = params[surrogateKey];
                delete params[surrogateKey];
            }    
        }

        if(topContent.saveBefore){
            var buffer=topContent.saveBefore("update",params);
            if(buffer){
                params=buffer;
            }
        }

        var sql=sqlBuilder.build.update(params);

        sqlBuilder.clearBuffer();

        var ormCallback = new OrmCallback();

        if(callback){
            ormCallback._callback=callback;
        }

        var response={};

        sync([
            function(next){
                baseObj.query(sql,null,function(res){
                    response=res;
                    next();
                });
            },
            function(){

                if(!response.status){
                    if(ormCallback._callbackError){
                        ormCallback._callbackError(response.error);
                    }
    
    
                    if(ormCallback._callback){
                        ormCallback._callback(response);
                    } 
                    return;
                }
                else{
    
                    if(!responseStatus){
                        if(surrogateKey){
                        
                            if(response.status){
                                if(ormCallback._callbackSuccess){
                                    ormCallback._callbackSuccess(response.result);
                                }    
                            }
        
                            if(ormCallback._callback){
                                ormCallback._callback(response);
                            } 
                            return;
                        }
                    }
    
                    selectObj
                        .where(surrogateKey,"=",_sid)
                        .first(function(res){
    
                            if(!res.status){
                                if(ormCallback._callbackError){
                                    ormCallback._callbackError(res.error);
                                }
                            }
                            else{
                                if(ormCallback._callbackSuccess){
                                    ormCallback._callbackSuccess(res.result);
                                }    
                            }
    
                            if(ormCallback._callback){
                                ormCallback._callback(res);
                            } 
                        });
                    ;
                }
            },
        ]);     
        
        return ormCallback;
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
                delete params[surrogateKey];
            }    
        }

        var sql=sqlBuilder.build.update(params);
        
        return sql;
    }

};
module.exports = OrmSave;