const OrmConnection = function(conData){
        
    this._constructor=function(){

        if(!conData.type){
            throw new Error("Specify either \"mysql\" or \"sqlite3\" as the type.");
        }
    
        if(conData.type.toLowerCase()=="mysql"){
            return this.connectWithMysql(conData);
        }
        else if(conData.type.toLowerCase()=="sqlite3"){
            return this.connectWithSqlite3(conData);
        }
        else{
            throw new Error("An unsupported SQL Type is specified.(SQL Type that can be specified is \"mysql\", \"sqlite3\".)")
        }
    
    };

    this.connectWithMysql = function(data){

        const mysql = require("mysql");

        if(!data.host){
            throw new Error("[CONNECT VALIDATION] The destination host name is not specified in \"host\"");
        }

        if(!data.port){
            throw new Error("[CONNECT VALIDATION] The destination port number is not specified in \"port\"");
        }

        if(!data.username){
            throw new Error("[CONNECT VALIDATION] The destination username is not specified in \"username\"");
        }

        if(!data.password){
            data.password="";
        }

        if(!data.database){
            data.database="";
        }

        var _obj = mysql.createConnection({
            host:data.host,
            port:data.port,
            user:data.user,
            password:data.password,
            database:data.database,
            encoding:data.encoding,
        });
        
     //   try{
            _obj.connect();
      //  }catch(error){
      //      throw new Error(error);
      //  }

        _obj.sqlType="mysql";

        return _obj;
    };

    this.connectWithSqlite3 = function(data){

        const sqlite3 = require("sqlite3").verbose();

        if(!data.path){
            throw new Error("[CONNECT VALIDATION] The destination path is not specified in \"path\"");
        }

        var _obj = new sqlite3.Database(data.path);

        _obj.sqlType="sqlite3";

        return _obj;
    };

    this.connectWithPgsql = function(data){

        // comming soon....!

    };

    return this._constructor();

};
module.exports = OrmConnection;