/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * show.js (OrmShow)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */
 
const OrmShow = function(topContent,baseObj){

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

        return baseObj.query(sql,null,callback);
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

        return baseObj.query(sql,null,callback);
    };

    /**
     * getDatabases
     * @param {*} callback 
     */
    this.getDatabases=function(callback){

        var sql="SHOW DATABASES";

        return baseObj.query(sql,null,callback);
    };

    /**
     * getTables
     * @param {*} callback 
     */
    this.getTables=function(callback){

		var sql="SHOW TABLES;";

        return baseObj.query(sql,null,callback);
    };

    /**
     * getVariables
     * @param {*} callback 
     */
    this.getVariables=function(callback){

	    var sql="SHOW VARIABLES;";

        return baseObj.query(sql,null,callback);
    };

    /**
     * getProcessList
     * @param {*} callback 
     */
    this.getProcessList=function(callback){
        var sql="SHOW PROCESSLIST;";
        
        return baseObj.query(sql,null,callback);
    };
    
};
module.exports = OrmShow;