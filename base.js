const ormConnection = require("./connection.js");

const ormBase = function(context){

    var connection = new ormConnection(context.connection());

    this.check=function(){
        if(connection){
            return true;
        }
        else{
            return false;
        }
    };

    this.query=function(sql,bind,callback,option){

        if(!option){
            option={};
        }

        if(connection.sqlType=="mysql"){

            connection.query(sql,bind,function(error,results){
                callback(error,results);
            });

        }
        else if(connection.sqlType=="sqlite3"){

            connection.serialize(() => {

                var sqlLower = sql.toLowerCase();

                var methodType="";
                if(sqlLower.indexOf("select")==0){
                    methodType="all";
                }
                if(option.methodType){
                    methodType=option.methodType;
                }

                if(methodType=="all"){
                    connection.all(sql,function(error,result){
                        callback(error,result);
                    });
                }
                else if(methodType=="get"){
                    connection.get(sql,function(error,result){
                        callback(error,result);
                    });
                }
                else if(methodType=="each"){
                    connection.each (sql,function(error,result){
                        callback(error,result);
                    });
                }
                else{
                    connection.run(sql);
                }            
            });
        }

    };

};

module.exports=ormBase;