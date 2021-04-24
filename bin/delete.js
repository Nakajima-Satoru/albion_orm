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
     * @param {*} option 
     * @param {*} callback 
     */
    this.physicalDelete = function(params,option,callback){

        var surrogateKey=topContext.checkSurrogateKey();

        if(surrogateKey){
            if(params){

                if(typeof params === "string" || typeof params === "number"){
                    params=[params];
                }
    
                this.where(surrogateKey,"IN",params);
            }
        }
    
        var sql = sqlBuilder.build.delete();

        sqlBuilder.clearBuffer();

        return baseObj.query(sql,null,callback);

    };

    /**
     * logicalDelete
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     */
    this.logicalDelete=function(params,option,callback){

        var surrogateKey=topContext.checkSurrogateKey();

        var logicalDeleteKey = topContext.getLogicalDeleteKey();

        var onValue=1;
        if(logicalDeleteKey.type=="date"){
            onValue=DateFormat(null,"Y-m-d");
        }
        else if(logicalDeleteKey.type=="datetime"){
            onValue=DateFormat(null,"Y-m-d H:i:s");
        }

        var ormCallback = new OrmCallback();

        if(callback){
            ormCallback._callback=callback;
        }

        if(surrogateKey){
            if(params){

                if(typeof params === "string" || typeof params === "number"){
                    params=[params];
                }    

                var length=params.length;

                var response={
                    statusSuccess:true,
                    statusError:false,
                    success:[],
                    error:[],
                };

                sync().foreach(params,function(next,index,value){

                    var updateData={
                        [surrogateKey]:params[index],
                        [logicalDeleteKey.field]:onValue,
                    };

                    saveObj.update(updateData,option,function(res){

                        if(res.status){
                           response.success.push(res.result); 
                        }
                        else{
                            response.statusSuccess=false;
                            response.statusError=true;
                            response.error.push(res.error); 
                        }

                        if(!res.status){
                            if(ormCallback._callbackError){
                                ormCallback._callbackError(res.error);
                            }
                        }

                        if(index < length-1){
                            next();
                        }
                        else{

                            if(response.statusError){
                                if(ormCallback._callbackSuccess){
                                    ormCallback._callbackSuccess(response.error);
                                }    
                            }

                            if(response.statusSuccess){
                                if(ormCallback._callbackSuccess){
                                    ormCallback._callbackSuccess(response.success);
                                }    
                            }

                            if(ormCallback._callback){

                                var res2={
                                    result:response.success,
                                    error:response.error,
                                };

                                if(response.statusSuccess){
                                    res2.status=true;    
                                }
                                else{
                                    res2.status=false;
                                }

                                ormCallback._callback(res2);
                            }

                        }
                    });

                });

            }
            else{


                
            }
        }
        else{

            option.surrogateOff=true;

            var updateData={
                [logicalDeleteKey.field]:onValue,
            };

            saveObj.update(updateData,option,function(res){
                callback(res);
            });

        }

        return ormCallback;
    };

    /**
     * revert
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     */
    this.revert=function(params,option,callback){

        var surrogateKey=topContext.checkSurrogateKey();

        var logicalDeleteKey = topContext.getLogicalDeleteKey();

        if(surrogateKey){

            if(params){

                if(typeof params === "string" || typeof params === "number"){
                    params=[params];
                }    
    
                var length=params.length;

                var response=[];

                sync().foreach(params,function(next,index,value){

                    var updateData={
                        [surrogateKey]:params[index],
                        [logicalDeleteKey.field]:null,
                    };

                    saveObj.update(updateData,option,function(res){

                        if(!res.status){
                            return callback(res);
                        }

                        response.push(res.result);

                        if(index < length-1){
                            next();
                        }
                        else{
                            res.result=response;
                            callback(res);
                        }
                    });

                });

            }

        }
        else{

            option.surrogateOff=true;

            var updateData={
                [logicalDeleteKey.field]:null,
            };

            saveObj.update(updateData,option,function(res){
                callback(res);
            });

        }

    };

};
module.exports = OrmDelete;