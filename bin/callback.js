/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * callback.js (OrmCallback)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const OrmCallback=function(){

    /**
     * then
     * @param {*} callback 
     * @returns 
     */
    this.then=function(callback){
        this._callback=callback;
        return this;
    };

    /**
     * error
     * @param {*} callback 
     * @returns 
     */
    this.error=function(callback){
        this._callbackError=callback;
        return this;
    };

    /**
     * success
     * @param {*} callback 
     * @returns 
     */
    this.success=function(callback){
        this._callbackSuccess=callback;
        return this;
    };

};
module.exports = OrmCallback;