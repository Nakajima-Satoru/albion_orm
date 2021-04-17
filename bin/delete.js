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
            this.physicalDelete(params,option,callback);
        }
        else if(delType==1){
            this.logicalDelete(params,option,callback);
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

        baseObj.query(sql,null,function(error,result){
            callback(error,result);
        });

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
            onValue=DateFormat(null,"Y-m-d H:i:s");
        }

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
                        [logicalDeleteKey.field]:onValue,
                    };

                    saveObj.update(updateData,option,function(error,result){

                        if(error){
                            callback(error);
                        }

                        response.push(result);

                        if(index < length-1){
                            next();
                        }
                        else{
                            callback(null,response);
                        }
                    });

                });

            }
        }
        else{
            option.surrogateOff=true;
            
        }

    };

};
module.exports = OrmDelete;