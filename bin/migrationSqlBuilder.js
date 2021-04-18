const OrmMMigrationSqlBuilder = function(buildData){

    var defaultOption={};

    this.run=function(){

        var response=[];

        for(var n=0;n<buildData.length;n++){
    
            var row=buildData[n];
    
            console.log(row);

            var res="";

            if(row.type=="comment"){
                res=this.comment(row);
            }else if(row.type=="createDatabase"){
                res=this.createDatabase(row);
            }
            else if(row.type=="createTable"){
                res=this.createTable(row);
            }
            else if(row.type=="createView"){
                res=this.createView(row);
            }
    
            response.push(res);
        }
    
        return response;
    };

    this.comment=function(data){
        var str="/* "+data.text+" */";
        return str;
    };

    this.createDatabase=function(data){

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
                    fopt.type="INT";
                }

                if(fopt.type=="INT" || fopt.type=="VARCHAR"){
                    fieldStr+=fopt.type+"("+fopt.length+") ";
                }
                else{
                    fieldStr+=fopt.type+" ";
                }

                if(fopt.notNull){
                    fieldStr+="NOT NULL ";
                }

                if(fopt.autoIncrement){
                    fieldStr+="AUTO_INCREMENT ";
                }

                if(fopt.primaryKey){
                    tableOption.primaryKey=field;
                }

                if(fopt.default!=undefined){
                    fieldStr+="DEFAULT '"+fopt.default+"' ";
                }

                if(fopt.comment){
                    fieldStr+="COMMENT '"+fopt.comment+"' ";
                }

                str+=fieldStr;
            }

            if(tableOption.primaryKey){
                str+=", PRIMARY KEY ("+tableOption.primaryKey+")"
            }

            str+=") ";
        }

        if(data.option.engine){
            str+="ENGINE = "+data.option.engine;
        }
        if(data.option.autoIncrement){
            str+="AUTO_INCREMENT = "+data.option.autoIncrement;
        }
        if(data.option.defaultCharset){
            str+="DEFAULT CHARSET = "+data.option.defaultCharset;
        }
        if(data.option.comment){
            str+="COMMENT = '"+data.option.comment+"'";
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

        if(data.option.ifNotExists){
            str+="IF NOT EXISTS ";
        }

        str+=data.viewName;

        if(data.option.sql){
            str+=" AS "+data.option.sql;
        }

        return str;
    };

    return this.run();
};
module.exports = OrmMMigrationSqlBuilder;

