/**
 * ==================================================
 * 
 * m02_orm
 * 
 * show.js (OrmShow)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */
 
const OrmShow = function(topContent,baseObj){

    /**
     * _query
     * @param {*} sql 
     * @param {*} callback 
     * @returns 
     */
    var _query=function(sql,callback){
        return baseObj.query(sql,null,callback,{
            connectionPooling:true,
        });
    };


    /**
     * getField
     * @param {*} callback 
     */
    this.getField=function(callback){

        var sqlType=topContent.connection().type;

        var tableName=topContent.table;

        var sql="";

        if(sqlType=="mysql"){
			sql="SHOW COLUMNS FROM "+tableName;
        }
        else if(sqlType=="sqlite3"){
			sql="PRAGMA table_info('"+tableName+"')";
        }

        return _query(sql,callback);
    };

    /**
     * getIndex
     * @param {*} callback 
     */
    this.getIndex=function(callback){

        var sqlType=topContent.connection().type;

        var tableName=topContent.table;

        var sql="";

        if(sqlType=="mysql"){
            sql="SHOW INDEX FROM "+tableName;
        }
        else if(sqlType=="sqlite3"){
			sql="select * from sqlite_master where name='"+tableName+"'";
		}

        return _query(sql,callback);
    };

    /**
     * getDatabases
     * @param {*} callback 
     */
    this.getDatabases=function(callback){

        var sql="SHOW DATABASES";

        return _query(sql,callback);
    };

    /**
     * getTables
     * @param {*} callback 
     */
    this.getTables=function(callback){

		var sql="SHOW TABLES;";

        return _query(sql,callback);
    };

    /**
     * getVariables
     * @param {*} callback 
     */
    this.getVariables=function(callback){

	    var sql="SHOW VARIABLES;";

        return _query(sql,callback);
    };

    /**
     * getProcessList
     * @param {*} callback 
     */
    this.getProcessList=function(callback){
        var sql="SHOW PROCESSLIST;";
        
        return _query(sql,callback);
    };
    
};
module.exports = OrmShow;