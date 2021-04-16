/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * select.js (OrmSelect)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const OrmSqlBuilder = require("./sqlBuilder.js");
const OrmSelectResponse = require("./selectResponse.js");

const OrmSelect = function(topContent,baseObj){

    var sqlBuilder = new OrmSqlBuilder(topContent);

    /**
     * select
     * @param {*} params 
     * @param {*} callback 
     */
    this.select=function(params, callback){


    };

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
     * field
     * @param {*} fields 
     * @returns 
     */
    this.field = function(fields){
        sqlBuilder.field(fields);
        return this;
    };

    /**
     * limit
     * @param {*} limit 
     * @param {*} offset 
     * @returns 
     */
    this.limit=function(limit,offset){
        sqlBuilder.limit(limit,offset);
        return this;
    };

    /**
     * orderBy
     * @param {*} field 
     * @param {*} sort 
     * @returns 
     */
    this.orderBy=function(field,sort){
        sqlBuilder.orderBy(field,sort);
        return this;
    };

    /**
     * groupBy
     * @param {*} field 
     * @returns 
     */
    this.groupBy=function(field){
        sqlBuilder.groupBy(field);
        return this;
    };

    /**
     * distinct
     * @param {*} status 
     * @returns 
     */
    this.distinct=function(status){
        sqlBuilder.distinct(status);
        return this;
    }

    /**
     * all
     * @param {*} callback 
     */
    this.all=function(callback){

        if(topContent.selectBefore){
            topContent.selectBefore(this);
        }

        var sql = sqlBuilder.build.select();

        baseObj.query(sql,null,function(error,result){

            if(topContent.selectAfter){
                var buffer=topContent.selectAfter(error,result);
                if(buffer){
                    result=buffer;
                }
            }
            
            callback(error,result);
        });
    };

    /**
     * first
     * @param {*} callback 
     */
    this.first=function(callback){
        this.limit(1).all(function(error,result){
            if(error){
                callback(error,null);
            }
            else{
                callback(null,result[0]);
            }
        });
    };

    /**
     * value
     * @param {*} field 
     * @param {*} callback 
     * @param {*} option 
     */
    this.value=function(field,callback,option){

        if(!option.noResetField){
            this.field().field([field]);
        }
        this.all(function(error,result){
            if(error){
                callback(error,null);
            }
            else{
                callback(null,result[0][field]);
            }
        });
    };

    /**
     * min
     * @param {*} field 
     * @param {*} callback 
     */
    this.min=function(field,callback){
        this.field().field(["MIN("+field+") AS "+field]).value(field,callback,{noResetField:true});
    };

    /**
     * max
     * @param {*} field 
     * @param {*} callback 
     */
    this.max=function(field,callback){
        this.field().field(["MAX("+field+") AS "+field]).value(field,callback,{noResetField:true});
    };

    /**
     * avg
     * @param {*} field 
     * @param {*} callback 
     */
    this.avg=function(field,callback){
        this.field().field(["AVG("+field+") AS "+field]).value(field,callback,{noResetField:true});
    };

    /**
     * sum
     * @param {*} field 
     * @param {*} callback 
     */
    this.sum=function(field,callback){
        this.field().field(["SUM("+field+") AS "+field]).value(field,callback,{noResetField:true});
    };

    /**
     * list
     * @param {*} field 
     * @param {*} callback 
     */
    this.list=function(field,callback){

        if(typeof field=="string"){
            var list=[];
            this.field().field([field]);
        }
        else{
            var list={};
            this.field().field([field[0],field[1]]);
        }

        this.all(function(error,result){
            if(error){
                callback(error,null);
            }
            else{

                for(var n=0;n<result.length;n++){

                    var row=result[n];

                    if(typeof field=="string"){
                        list.push(row[field]);
                    }
                    else{
                        list[row[field[0]]]=row[field[1]];
                    }
    
                }

                callback(null,list);
            }
        });

    };

    /**
     * count
     * @param {*} callback 
     */
    this.count=function(callback){
        this.field().field(["count(*) as count"]).all(function(error,result){
            if(error){
                callback(error,null);
            }
            else{
                callback(null,result[0]);
            }
        });
    };

    /**
     * sql
     * @returns 
     */
    this.sql=function(){
        return sqlBuilder.build.select();
    };

};
module.exports = OrmSelect;