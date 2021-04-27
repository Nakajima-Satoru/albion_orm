const ormConnection = require("./connection.js");
const hash = require("./hash.js");

const OrmConnectionPooling = {

    _pools:{},

    set:function(connection,callback,ormCallback){

        var connectionHash=hash("sha256",JSON.stringify(connection));

        if(this._pools[connectionHash]){
            callback(this._pools[connectionHash]);
            return;
        }

        var cont=this;

        new ormConnection(connection,function(res){

            if(!res.status){
                if(ormCallback._callbackError){
                    ormCallback._callbackError(res.error);
                }


                if(ormCallback._callback){
                    ormCallback._callback(res);
                }
                return
            }

            cont._pools[connectionHash]=res.connection;

            callback(cont._pools[connectionHash]);

        });

    },

};
module.exports = OrmConnectionPooling;