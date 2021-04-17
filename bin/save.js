/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * save.js (OrmSave)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

 const OrmSqlBuilder = require("./sqlBuilder.js");
 
const OrmSave = function(topContent){

    var sqlBuilder = new OrmSqlBuilder(topContent);

    /**
     * auto
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     */
    this.auto=function(params, option, callback){


    };

    /**
     * insert
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     */
    this.insert=function(params,option,callback){



    };
};
module.exports = OrmSave;