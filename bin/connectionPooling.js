const ormConnection = require("./connection.js");
const hash = require("./hash.js");

const OrmConnectionPooling = {

    _pools:{},

    set:function(connection,callback){

        var connectionHash=hash("sha256",JSON.stringify(connection));

        if(this._pools[connectionHash]){
            callback({
                status:true,
                connection:this._pools[connectionHash],
            });
            return;
        }

        var cont=this;

        new ormConnection(connection,function(res){

            if(!res.status){
                callback(res);
                return;
            }

            cont._pools[connectionHash]=res.connection;

            callback({
                status:true,
                connection:res.connection,
            });

        });

    },

};
module.exports = OrmConnectionPooling;