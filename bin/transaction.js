/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * transaction.js (OrmTransaction)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const sync = require("./sync.js");
const ormBase = require("./base.js");

const OrmTransaction = function(context){

    var myBaseObj=new ormBase(context);

    /**
     * transam
     * @param {*} callback 
     * @param {*} errorCallback 
     */
    this.transam=function(callback,errorCallback){

        var cont = this;

        var _status=true;

        sync([
            function(next){

                cont.begin(function(res){

                    if(!res.status){
                        errorCallback();
                        return;
                    }

                    next();
                });

            },
            function(next){
                
                var resolve=function(status){
                    if(status==undefined){
                        status=true;
                    }
                    _status=status;
                    next();
                };

                callback(resolve);
            },
            function(){

                if(_status){

                    cont.commit(function(res){

                        if(!res.status){
                            errorCallback();
                            return;
                        }
    
                    });
    
                }
                else{

                    cont.rollback(function(res){

                        if(!res.status){
                            errorCallback();
                            return;
                        }
    
                    });
    
                }
            },
        ]);

    };

    /**
     * begin
     * @param {*} callback 
     * @returns 
     */
    this.begin=function(callback){
        var sql ="BEGIN;";
        return myBaseObj.query(sql,null,callback);
    };

    /**
     * commit
     * @param {*} callback 
     * @returns 
     */
     this.commit=function(callback){
        var sql ="COMMIT;";
        return myBaseObj.query(sql,null,callback);
    };

    /**
     * rollback
     * @param {*} callback 
     * @returns 
     */
     this.rollback=function(callback){
        var sql ="ROLLBACK;";
        return myBaseObj.query(sql,null,callback);
    };


    

};
module.exports = OrmTransaction;