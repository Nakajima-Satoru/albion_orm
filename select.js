const OrmSqlBuilder = require("./sqlBuilder.js");

const OrmSelect = function(context,topContent){

    var sqlBuilder = new OrmSqlBuilder(context,topContent);

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

    this.get=function(outType){

        return sqlBuilder.build.select();

    };


};
module.exports = OrmSelect;