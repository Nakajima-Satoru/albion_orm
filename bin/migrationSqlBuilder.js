/**
 * ==================================================
 * 
 * FW_DAGGER_ORM Ver 1.0.0
 * 
 * migration.js (OrmMigration)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const OrmMMigrationSqlBuilder = function(sqlType,buildData){

    var defaultOption={};

    /**
     * run
     * @returns 
     */
    this.run=function(){

        var response=[];

        for(var n=0;n<buildData.length;n++){
    
            var row=buildData[n];
    
            var res="";

            if(row.type=="comment"){
                res=this.comment(row);
            }else if(row.type=="createDatabase"){
                res=this.createDatabase(row);
            }
            else if(row.type=="changeDatabase"){
                res=this.changeDatabase(row);
            }
            else if(row.type=="createTable"){
                res=this.createTable(row);
            }
            else if(row.type=="createView"){
                res=this.createView(row);
            }
            else if(row.type=="alterTable"){
                res=this.alterTable(row);
            }
            else if(row.type=="dropTable"){
                res=this.dropTable(row);
            }
            else if(row.type=="dropView"){
                res=this.dropView(row);
            }
            else if(row.type=="insert"){
                res=this.insert(row);
            }
    
            if(res){
                response.push(res);
            }
        }
    
        return response;
    };

    /**
     * comment
     * @param {*} data 
     * @returns 
     */
    this.comment=function(data){
        if(sqlType=="sqlite3"){
            return "";
        }

        var str="/* "+data.text+" */";
        return str;
    };

    /**
     * createDatabase
     * @param {*} data 
     * @returns 
     */
    this.createDatabase=function(data){

        if(sqlType=="sqlite3"){
            return "";
        }

        var str="CREATE DATABASE ";

        if(data.option.ifNotExists){
            str+="IF NOT EXISTS ";
        }

        str+=data.databaseName;

        if(data.option.defaultCharset){
            defaultOption.charset=data.option.defaultCharset;
        }

        if(data.option.defaultEngine){
            defaultOption.charset=data.option.defaultEngine;
        }

        if(data.option.defaultCollate){
            str+=" DEFAULT COLLATE "+data.option.defaultCollate;
        }

        return str;
    };

    /**
     * changeDatabase
     * @param {*} data 
     * @returns 
     */
    this.changeDatabase=function(data){

        if(sqlType=="sqlite3"){
            return "";
        }

        var str="USE "+data.databaseName;
        return str;
    };

    /**
     * createTable
     * @param {*} data 
     * @returns 
     */
    this.createTable=function(data){

        var str="CREATE TABLE ";

        if(data.option.ifNotExists){
            str+="IF NOT EXISTS ";
        }

        str+=data.tableName;

        if(data.option.fields){
            var fields=data.option.fields;

            var tableOption={};

            str+=" ("
            var colum=Object.keys(fields);
            for(var n=0;n<colum.length;n++){

    
                if(n!=0){
                    str+=",";
                }

                var field=colum[n];
                var fopt=fields[field];

                var fieldStr=field+" ";

                fopt.type=fopt.type.toUpperCase();

                if(fopt.type=="INTEGER"){
                    if(sqlType=="mysql"){
                        fopt.type="INT";
                    }
                }


                if(fopt.type=="INT" || fopt.type=="VARCHAR" || fopt.type=="TINYINT"){
                    if(sqlType=="mysql"){
                        fieldStr+=fopt.type+"("+fopt.length+") ";
                    }
                    else if(sqlType=="sqlite3"){
                        fieldStr+=fopt.type+" ";
                    }
                }
                else{
                    fieldStr+=fopt.type+" ";
                }

                if(fopt.notNull){
                    fieldStr+="NOT NULL ";
                }

                if(fopt.autoIncrement){
                    if(sqlType=="mysql"){
                        fieldStr+="AUTO_INCREMENT ";
                    }
                }

                if(fopt.primaryKey){
                    tableOption.primaryKey=field;
                }

                if(fopt.default!=undefined){
                    fieldStr+="DEFAULT '"+fopt.default+"' ";
                }

                if(fopt.comment){
                    if(sqlType=="mysql"){
                        fieldStr+="COMMENT '"+fopt.comment+"' ";
                    }
                }

                str+=fieldStr;
            }

            if(tableOption.primaryKey){
                str+=", PRIMARY KEY ("+tableOption.primaryKey+")"
            }

            str+=") ";
        }
        else{
            str+=" (\n)";
        }

        if(data.option.engine){
            if(sqlType=="mysql"){
                str+="ENGINE = "+data.option.engine;
            }
        }
        if(data.option.autoIncrement){
            if(sqlType=="mysql"){
                str+="AUTO_INCREMENT = "+data.option.autoIncrement;
            }
        }
        if(data.option.defaultCharset){
            if(sqlType=="mysql"){
                str+="DEFAULT CHARSET = "+data.option.defaultCharset;
            }
        }
        if(data.option.comment){
            if(sqlType=="mysql"){
                str+="COMMENT = '"+data.option.comment+"'";
            }
        }

        return str;
    };

    /**
     * createView
     * @param {*} data 
     * @returns 
     */
    this.createView=function(data){

        var str="CREATE VIEW ";

        str+=data.viewName;

        if(data.sql){
            str+=" AS "+data.sql;
        }

        return str;
    };

    /**
     * alterTable
     * @param {*} data 
     * @returns 
     */
    this.alterTable=function(data){
        var str="";

        return str;
    };

    /**
     * dropTable
     * @param {*} data 
     * @returns 
     */
    this.dropTable=function(data){
        var str="DROP TABLE ";

        if(data.option.ifExists){
            str+="IF EXISTS ";
        }

        str+=data.tableName;

        return str;
    };

    /**
     * dropView
     * @param {*} data 
     * @returns 
     */
    this.dropView=function(data){
        var str="";

        var str="DROP VIEW ";

        if(data.option.ifExists){
            str+="IF EXISTS ";
        }

        str+=data.viewName;

        return str;
    };

    /**
     * _s
     * @param {*} string 
     * @returns 
     */
     this._s=function(string){

        if(typeof string!="string"){
            return string;
        }

        string=string.split("\"").join("\\\"");

        return "\""+string+"\"";
    };

    return this.run();
};
module.exports = OrmMMigrationSqlBuilder;