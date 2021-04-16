const OrmSqlBuilder = require("./sqlBuilder.js");

const OrmSelect = function(topContent,baseObj){

    var sqlBuilder = new OrmSqlBuilder(topContent);

    this.select=function(params, callback){


    };

    this.where = function(field,operand,value,index,logicalOperand){
        sqlBuilder.where(field,operand,value,index,logicalOperand);
        return this;
    };

    this.whereAnd = function(field,operand,value,index){
        sqlBuilder.whereAnd(field,operand,value,index);
        return this;
    };

    this.whereOr = function(field,operand,value,index){
        sqlBuilder.whereOr(field,operand,value,index);
        return this;
    };

    this.field = function(fields){
        sqlBuilder.field(fields);
        return this;
    };

    this.limit=function(limit,offset){
        sqlBuilder.limit(limit,offset);
        return this;
    };

    this.orderBy=function(field,sort){
        sqlBuilder.orderBy(field,sort);
        return this;
    };

    this.groupBy=function(field){
        sqlBuilder.groupBy(field);
        return this;
    };

    this.distinct=function(status){
        sqlBuilder.distinct(status);
        return this;
    }

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

    this.min=function(field,callback){
        this.field().field(["MIN("+field+") AS "+field]).value(field,callback,{noResetField:true});
    };

    this.max=function(field,callback){
        this.field().field(["MAX("+field+") AS "+field]).value(field,callback,{noResetField:true});
    };

    this.avg=function(field,callback){
        this.field().field(["AVG("+field+") AS "+field]).value(field,callback,{noResetField:true});
    };

    this.sum=function(field,callback){
        this.field().field(["SUM("+field+") AS "+field]).value(field,callback,{noResetField:true});
    };

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

    this.sql=function(){
        return sqlBuilder.build.select();
    };

};
module.exports = OrmSelect;