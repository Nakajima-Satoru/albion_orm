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

        var sqlType=topContent._orm.connection().type;

        var tableName=topContent.table;

        var sql="";

        if(sqlType=="mysql"){
			sql="SHOW COLUMNS FROM "+tableName;
        }
        else if(sqlType=="sqlite3"){
			sql="PRAGMA table_info('"+tableName+"')";
        }

        baseObj.query(sql,null,function(res){
            callback(res);
        });
    };

    /**
     * getIndex
     * @param {*} callback 
     */
    this.getIndex=function(callback){

        var sqlType=topContent._orm.connection().type;

        var tableName=topContent.table;

        var sql="";

        if(sqlType=="mysql"){
            sql="SHOW INDEX FROM "+tableName;
        }
        else if(sqlType=="sqlite3"){
			sql="select * from sqlite_master where name='"+tableName+"'";
		}

        baseObj.query(sql,null,function(res){
            callback(res);
        });
    };

    /**
     * getDatabases
     * @param {*} callback 
     */
    this.getDatabases=function(callback){

        var sql="SHOW DATABASES";

        baseObj.query(sql,null,function(res){
            callback(res);
        });
    };

    /**
     * getTables
     * @param {*} callback 
     */
    this.getTables=function(callback){

		var sql="SHOW TABLES;";

        baseObj.query(sql,null,function(res){
            callback(res);
        });
    };

    /**
     * getVariables
     * @param {*} callback 
     */
    this.getVariables=function(callback){

	    var sql="SHOW VARIABLES;";

        baseObj.query(sql,null,function(res){
            callback(res);
        });
    };

    /**
     * getProcessList
     * @param {*} callback 
     */
    this.getProcessList=function(callback){
        var sql="SHOW PROCESSLIST;";
        
        baseObj.query(sql,null,function(res){
            callback(res);
        });
    };
    
};
module.exports = OrmShow;