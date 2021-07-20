/**
 * ==================================================
 * 
 * m02_orm
 * 
 * select.js (OrmSelect)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const OrmSqlBuilder = require("./sqlBuilder.js");
const sync = require("./sync.js");
const OrmCallback = require("./callback.js");

const OrmSelect = function(topContent,baseObj){

    var sqlBuilder = new OrmSqlBuilder(topContent);

    var _logical_delete_mode = "normal";

    /**
     * select
     * @param {*} params 
     */
    this.select=function(params){

        var colum=Object.keys(prams);
        for(var n=0;n<colum.length;n++){
            var method=colum[n];
            var param=params[method];
            
            if(this[method]){
                this[method](...param);
            }

        }

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
     * logicaldeleteOnly
     * @param {*} status 
     * @returns 
     */
     this.logicaldeleteOnly=function(status){
         if(status){
            _logical_delete_mode="only";
         }
         else{
            _logical_delete_mode="normal";
         }
        return this;
    };

    /**
     * logicaldeleteIncludes
     * @param {*} status 
     * @returns 
     */
     this.logicaldeleteIncludes=function(status){
        if(status){
           _logical_delete_mode="includes";
        }
        else{
           _logical_delete_mode="normal";
        }
       return this;
   };

    /**
     * all
     * @param {*} callback 
     * @param {*} type 
     * @param {*} field 
     */
    this.all=function(callback,type,field){

        if(!type){
            type="all";
        }
        
        if(topContent.logicalDeleteKey){
            if(_logical_delete_mode=="normal"){

                if(topContent.logicalDeleteKey.type=="integer"){
                    this.where(topContent.logicalDeleteKey.field,"=",0);
                }
                else if(topContent.logicalDeleteKey.type=="date" || topContent.logicalDeleteKey.type=="datetime"){
                    this.where(topContent.logicalDeleteKey.field,"IS",null);
                }
                
            }
            else if(_logical_delete_mode=="only"){

                if(topContent.logicalDeleteKey.type=="integer"){
                    this.where(topContent.logicalDeleteKey.field,"=",1);
                }
                else if(topContent.logicalDeleteKey.type=="date" || topContent.logicalDeleteKey.type=="datetime"){
                    this.where(topContent.logicalDeleteKey.field,"IS NOT",null);
                }

            }
        }

        if(topContent.selectBefore){
            topContent.selectBefore(this);
        }

        var sql = sqlBuilder.build.select();

        sqlBuilder.clearBuffer();
        
        var ormCallback= new OrmCallback();

        if(callback){
            ormCallback._callback=callback;
        }

        baseObj.query(sql,null,function(res){

            if(!res.status){
                if(ormCallback._callbackError){
                    ormCallback._callbackError(res.error);
                }
            }
            
            if(res.status){


                if(type=="first"){
                    res.result=res.result[0];
                }
                else if(type=="value"){
                    res.result=res.result[0][field];
                }
                else if(type=="list"){

                    if(typeof field == "string"){
                        var list=[];
                    }
                    else{
                        var list={};
                    }

                    for(var n=0;n<res.result.length;n++){

                        var row=res.result[n];
        
                        if(typeof field == "string"){
                            list.push(row[field]);
                        }
                        else{
                            list[row[field[0]]]=row[field[1]];
                        }
            
                    }

                    res.result=list;
                }
                else if(type=="count"){
                    res.result=res.result[0].count;
                }

                if(topContent.selectAfter){
                    var buffer=topContent.selectAfter(type,res);
                    if(buffer){
                        res=buffer;
                    }
                }
                if(ormCallback._callbackSuccess){
                    ormCallback._callbackSuccess(res.result);
                }    
            }
            
            if(ormCallback._callback){
                ormCallback._callback(res);
            }

        },{
            connectionPooling:true,
        });

        return ormCallback;
    };

    /**
     * first
     * @param {*} callback 
     */
    this.first=function(callback){
        return this.limit(1).all(callback,"first");
    };

    /**
     * value
     * @param {*} field 
     * @param {*} callback 
     * @param {*} option 
     */
    this.value=function(field,callback,option){

        if(!option){
            option={};
        }

        if(!option.noResetField){
            this.field().field([field]);
        }

        return this.all(callback,"value",field);
    };

    /**
     * min
     * @param {*} field 
     * @param {*} callback 
     */
    this.min=function(field,callback){
        return this
            .field()
            .field(["MIN("+field+") AS "+field])
            .value(field,callback,{
                noResetField:true,
            });
    };

    /**
     * max
     * @param {*} field 
     * @param {*} callback 
     */
    this.max=function(field,callback){
        return this
            .field()
            .field(["MAX("+field+") AS "+field])
            .value(field,callback,{
                noResetField:true,
            });
    };

    /**
     * avg
     * @param {*} field 
     * @param {*} callback 
     */
    this.avg=function(field,callback){
        return this
            .field()
            .field(["AVG("+field+") AS "+field])
            .value(field,callback,{
                noResetField:true,
            });
    };

    /**
     * sum
     * @param {*} field 
     * @param {*} callback 
     */
    this.sum=function(field,callback){
        return this
            .field()
            .field(["SUM("+field+") AS "+field])
            .value(field,callback,{
                noResetField:true,
            });
    };

    /**
     * list
     * @param {*} field 
     * @param {*} callback 
     */
    this.list=function(field,callback){

        if(typeof field=="string"){
            this.field().field([field]);
        }
        else{
            this.field().field([field[0],field[1]]);
        }

        return this.all(callback,"list",field);
    };

    /**
     * count
     * @param {*} callback 
     */
    this.count=function(callback){

        return this
            .field()
            .field(["count(*) as count"])
            .all(callback,"count");
    };

    /**
     * paginate
     * @param {*} limit 
     * @param {*} page 
     * @param {*} callback 
     */
    this.paginate=function(limit,page,callback){

        if(!page){
            page=1;
        }

        var offset=(page-1)*limit;

        var totalCount=0;

        var cont=this;

        var ormCallback= new OrmCallback();

        if(callback){
            ormCallback._callback=callback;
        }

        sync([
            function(next){

                cont
                    .limit(limit,offset)
                    .count(function(res){

                        if(!res.status){
                            if(ormCallback._callbackError){
                                ormCallback._callbackError(res.error);
                            }

                            if(ormCallback._callback){
                                ormCallback._callback(res);
                            }
                            return;
                        }

                        totalCount=res.result;

                        next();
                    });

            },
            function(){

                cont
                    .limit(limit,offset)
                    .all(function(res){
        
                        if(!res.status){
                            if(ormCallback._callbackError){
                                ormCallback._callbackError(res.error);
                            }
                        }
                        else{

                            var totalPage=Math.ceil(totalCount/limit);

                            res.paginate={
                                totalCount:totalCount,
                                totalPage:totalPage,
                                page:page,
                                limit:limit,
                            };

                            if(ormCallback._callbackSuccess){
                                ormCallback._callbackSuccess(res);
                            }
                        }        

                        if(ormCallback._callback){
                            ormCallback._callback(res);
                        }

                    });
            },
        ]);

        return ormCallback;
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