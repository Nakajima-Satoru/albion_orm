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

const OrmMigration = function(context){

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
        _buffer.push({
            type:"createDatabase",
            databaseName:databaseName,
            option:option,
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
        _buffer.push({
            type:"alterTable",
            tableName:tableName,
            option:option,
        });
        return this;
    };

    /**
     * dropTable
     * @param {*} tableName 
     * @returns 
     */
    this.dropTable=function(tableName){
        _buffer.push({
            type:"dropTable",
            tableName:tableName,
        });
        return this;
    };

    /**
     * dropView
     * @param {*} viewName 
     * @returns 
     */
    this.dropView=function(viewName){
        _buffer.push({
            type:"dropView",
            viewName:viewName,
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
     * @returns 
     */

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

    this.query=function(){

        var sql = this.sql();


    };

};
module.exports = OrmMigration;