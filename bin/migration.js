/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * migration.js (OrmMigration)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const OrmMMigrationSqlBuilder = require("./migrationSqlBuilder.js");
const sync = require("./sync.js");

const OrmMigration = function(baseObj){

    var _buffer=[];

    /**
     * comment
     * @param {*} string 
     * @returns 
     */
    this.comment=function(string){
        _buffer.push({
            type:"comment",
            text:string,
        });
        return this;
    };

    /**
     * createDatabase
     * @param {*} databaseName 
     * @param {*} option 
     * @returns 
     */
    this.createDatabase=function(databaseName,option){

        if(!option){
            option={};
        }

        _buffer.push({
            type:"createDatabase",
            databaseName:databaseName,
            option:option,
        });
        return this;
    };

    /**
     * changeDatabase
     * @param {*} databaseName 
     * @returns 
     */
    this.changeDatabase=function(databaseName){
        _buffer.push({
            type:"changeDatabase",
            databaseName:databaseName,
        });
        return this;
    };

    /**
     * createTable
     * @param {*} tableName 
     * @param {*} option 
     * @returns 
     */
    this.createTable=function(tableName,option){

        if(!option){
            option={};
        }

        _buffer.push({
            type:"createTable",
            tableName:tableName,
            option:option,
        });
        return this;
    };

    /**
     * createView
     * @param {*} viewName 
     * @param {*} option 
     * @returns 
     */
    this.createView=function(viewName,option){

        if(!option){
            option={};
        }

        _buffer.push({
            type:"createView",
            viewName:viewName,
            option:option,
        });
        return this;
    };

    /**
     * alterTable
     * @param {*} tableName 
     * @param {*} option 
     * @returns 
     */
    this.alterTable=function(tableName,option){

        if(!option){
            option={};
        }

        _buffer.push({
            type:"alterTable",
            tableName:tableName,
            option:option,
        });
        return this;
    };

    /**
     * tropDatabase
     * @param {*} databaseName 
     * @param {*} option 
     * @returns 
     */
    this.tropDatabase=function(databaseName,option){

        if(!option){
            option={};
        }

        _buffer.push({
            type:"tropDatabase",
            databaseName:databaseName,
            option:option,
        });
        return this;
    };

    /**
     * dropTable
     * @param {*} tableName 
     * @param {*} option 
     * @returns 
     */
    this.dropTable=function(tableName,option){

        if(!option){
            option={};
        }

        _buffer.push({
            type:"dropTable",
            tableName:tableName,
            option:option,
        });
        return this;
    };

    /**
     * dropView
     * @param {*} viewName 
     * @param {*} option 
     * @returns 
     */
    this.dropView=function(viewName,option){

        if(!option){
            option={};
        }

        _buffer.push({
            type:"dropView",
            viewName:viewName,
            option:option,
        });
        return this;
    };

    /**
     * insert
     * @param {*} tableName 
     * @param {*} data 
     * @returns 
     */
    this.insert=function(tableName,data){
        _buffer.push({
            type:"insert",
            tableName:tableName,
            data:data,
        });
        return this;
    };

    /**
     * sqls
     * @param {*} stringOutputed 
     * @returns 
     */
    this.sqls=function(stringOutputed){

        var sqls = new OrmMMigrationSqlBuilder(_buffer);

        if(stringOutputed){
            sqls=sqls.join(";\n\n");
        }

        return sqls;
    };

    /**
     * query
     * @param {*} callback 
     */
    this.query=function(callback){

        var sqls = this.sqls();

        sync().foreach(sqls,function(next,index,value){

            baseObj.query(value,null,function(error,result){
                if(error){
                    callback(error);                    
                    return;
                }

                if(index<sqls.length-1){
                    next();
                }
                else{
                    callback();
                }
            });

        });

    };

};
module.exports = OrmMigration;