/**
 * ==================================================
 * 
 * FW_DAGGER_ORM Ver 1.0.0
 * 
 * connection.js (OrmConnection)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const OrmConnection = function(conData,callback){
        
    /**
     * _constructor
     * @param {*} callback 
     * @returns 
     */
    this._constructor=function(callback){

        if(!conData.type){
            throw new Error("Specify either \"mysql\" or \"sqlite3\" as the type.");
        }
    
        if(conData.type.toLowerCase()=="mysql"){
            return this.connectWithMysql(conData,callback);
        }
        else if(conData.type.toLowerCase()=="sqlite3"){
            return this.connectWithSqlite3(conData,callback);
        }
        else{
            throw new Error("An unsupported SQL Type is specified.(SQL Type that can be specified is \"mysql\", \"sqlite3\".)")
        }
    
    };

    /**
     * connectWithMysql
     * @param {*} data 
     * @returns 
     */
    this.connectWithMysql = function(data){

        const mysql = require("mysql");

        if(!data.host){
            throw new Error("[CONNECT VALIDATION] The destination host name is not specified in \"host\"");
        }

        if(!data.username){
            throw new Error("[CONNECT VALIDATION] The destination username is not specified in \"username\"");
        }

        var _data={
            host:data.host,
            user:data.username,
        };

        if(data.port){
            _data.port=data.port;
        }
        else{
            _data.port=3306;
        }

        if(data.password){
            _data.password=data.password;
        }
        else{
            _data.password="";
        }

        if(data.database){
            _data.database=data.database;
        }
        else{
            _data.database="";
        }

        var _obj = mysql.createConnection(_data);

        _obj.connect(function(error){
        
            if(error){
                callback({
                    status:false,
                    error:error,
                });
                return;
            }

            if(callback){
                callback({
                    status:true,
                    connection:_obj,
                });
            }
        });

        _obj.sqlType="mysql";

        return _obj;
    };

    /**
     * connectWithSqlite3
     * @param {*} data 
     * @returns 
     */
    this.connectWithSqlite3 = function(data){

        const sqlite3 = require("sqlite3").verbose();

        if(!data.path){
            throw new Error("[CONNECT VALIDATION] The destination path is not specified in \"path\"");
        }

        var _obj = new sqlite3.Database(data.path);

        _obj.sqlType="sqlite3";

        callback(_obj);
        
        return _obj;
    };

    /**
     * connectWithPgsql
     * @param {*} data 
     */
    this.connectWithPgsql = function(data){

        // comming soon....!

    };

    return this._constructor(callback);

};
module.exports = OrmConnection;