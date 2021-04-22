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

const OrmTransaction = function(topContent){

    /**
     * begin
     */
    this.begin=function(){

        var sql ="BEGIN;";




    };

    /**
     * commit
     */
    this.commit=function(){

        var sql ="COMMIT;";

        


    };

    /**
     * rollback
     */
    this.rollback=function(){

        var sql ="ROLLBACK;";

        
    };


    this.save=function(data){

    };


};
module.exports = OrmTransaction;