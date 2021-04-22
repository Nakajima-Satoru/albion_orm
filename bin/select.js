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
const sync = require("./sync.js");

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

        sqlBuilder.clearBuffer();
        
        baseObj.query(sql,null,function(res){

            if(topContent.selectAfter){
                var buffer=topContent.selectAfter(res);
                if(buffer){
                    result=buffer;
                }
            }
            
            callback(res);
        });
    };

    /**
     * first
     * @param {*} callback 
     */
    this.first=function(callback){
        this.limit(1).all(function(res){

            if(res.status){
                res.result=res.result[0];
            }
            callback(res);
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
        this.all(function(res){

            if(res.status){
                res.result=res.result[0][field];
            }

            callback(res);
        });
    };

    /**
     * min
     * @param {*} field 
     * @param {*} callback 
     */
    this.min=function(field,callback){
        this
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
        this
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
        this
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
        this
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
            var list=[];
            this.field().field([field]);
        }
        else{
            var list={};
            this.field().field([field[0],field[1]]);
        }

        this.all(function(res){

            if(!res.status){
                return callback(res);
            }

            for(var n=0;n<result.length;n++){

                var row=result[n];

                if(typeof field=="string"){
                    list.push(row[field]);
                }
                else{
                    list[row[field[0]]]=row[field[1]];
                }
    
            }

            res.result=list;

            callback(res);
        });

    };

    /**
     * count
     * @param {*} callback 
     */
    this.count=function(callback){
        this
            .field()
            .field(["count(*) as count"])
            .all(function(res){

                if(res.status){
                    res.result=res.result[0].count;
                }

                callback(res);
            });
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

        sync([
            function(next){

                cont
                    .limit(limit,offset)
                    .count(function(res){

                        if(!res.status){
                            return callback(res);
                        }

                        totalCount=res.result;

                        next();
                    });

            },
            function(next){

                cont
                    .limit(limit,offset)
                    .all(function(res){
        
                        if(!res.status){
                            return callback(res);
                        }
        
                        var totalPage=Math.ceil(totalCount/limit);

                        res.paginate={
                            totalcount:totalCount,
                            totalPage:totalPage,
                            page:page,
                            limit:limit,
                        };

                        callback(res);        
                    });
            },
        ]);

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