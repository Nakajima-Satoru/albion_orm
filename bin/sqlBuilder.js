/**
 * ==================================================
 * 
 * ALBION_ORM Ver 1.0.0
 * 
 * sqlBuilder.js (OrmSqlBuilder)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const OrmSqlBuilder = function(topContent){

    var _buffer={
        field:[],
        where:[],
        limit:null,
        offset:null,
        orderBy:[],
        groupBy:[],
    };

    var cont=this;

    /**
     * where
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} index 
     * @param {*} logicalOperand 
     */
    this.where=function(field,operand,value,index,logicalOperand){

        if(
            !field && 
            !operand && 
            !value &&
            !index &&
            !logicalOperand
        ){
            _buffer.where=[];
            return;
        }

        if(!logicalOperand){
            logicalOperand="AND";
        }
        if(!index){
            index=0;
        }

        _buffer.where.push({
            field:field,
            operand:operand,
            value:value,
            logicalOperand:logicalOperand,
            index:index,
        });
    };

    /**
     * whereAnd
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} index 
     */
    this.whereAnd=function(field,operand,value,index){

        _buffer.where.push({
            field:field,
            operand:operand,
            value:value,
            logicalOperand:"AND",
            index:index,
        });
    };

    /**
     * whereOr
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} index 
     */
    this.whereOr=function(field,operand,value,index){

        _buffer.where.push({
            field:field,
            operand:operand,
            value:value,
            logicalOperand:"OR",
            index:index,
        });
    };

    /**
     * field
     * @param {*} fields 
     */
    this.field=function(fields){

        if(fields){
            for(var n=0;n<fields.length;n++){
                _buffer.field.push(fields[n]);
            }
        }
        else{
            _buffer.field=[];
        }

    };

    /**
     * limit
     * @param {*} limit 
     * @param {*} offset 
     */
    this.limit=function(limit,offset){
        
        _buffer.limit=limit;

        if(offset){
            _buffer.offset=offset;
        }
        else{
            _buffer.offset=null;
        }
    };

    /**
     * orderBy
     * @param {*} field 
     * @param {*} sort 
     */
    this.orderBy=function(field,sort){

        _buffer.orderBy.push({
            field:field,
            sort:sort,
        });
    };

    /**
     * groupBy
     * @param {*} field 
     */
    this.groupBy=function(field){
        _buffer.groupBy.push(field);
    };

    /**
     * distinct
     * @param {*} status 
     */
    this.distinct=function(status){
        _buffer.distinct=status;
    }

    /**
     * build
     */
    this.build={

        /**
         * select
         * @returns 
         */
        select:function(){

            var fieldStr=cont.convert.field();

            var distinctStr="";
            if(_buffer.distinct){
                distinctStr="DISTINCT ";
            }

            var optionStr="";
            optionStr+=cont.convert.where();
            optionStr+=cont.convert.limit();
            optionStr+=cont.convert.orderBy();
            optionStr+=cont.convert.groupBy();

            var str="SELECT "+distinctStr+fieldStr+" FROM "+topContent.table+optionStr;

            return str;
        },

        /**
         * insert
         * @param {*} params 
         * @returns 
         */
        insert:function(params){

            var fieldListStr="";
            var valueListStr="";

            var colum=Object.keys(params);
            for(var n=0;n<colum.length;n++){
                var field=colum[n];
                var value=params[field];

                if(n!=0){
                    fieldListStr+=", ";
                    valueListStr+=", ";
                }
                fieldListStr+=field;

                if(value === null){
                    valueListStr+="NULL";
                }
                else{
                    valueListStr+=cont._s(value);
                }
            }

            var str="INSERT INTO "+topContent.table+" ("+fieldListStr+") VALUES ("+valueListStr+")";

            return str;
        },

        /**
         * update
         * @param {*} params 
         * @returns 
         */
        update:function(params){

            var updateListStr="";
            var optionStr="";

            var colum=Object.keys(params);
            for(var n=0;n<colum.length;n++){
                var field=colum[n];
                var value=params[field];

                if(n!=0){
                    updateListStr+=", ";
                }

                if(value === null){
                    updateListStr+=field+" = NULL";
                }
                else{
                    updateListStr+=field+" = "+cont._s(value);
                }
            }

            optionStr+=cont.convert.where();

            var str="UPDATE "+topContent.table+" SET "+updateListStr+optionStr;

            return str;
        },

        /**
         * physicalDelete
         * @param {*} field 
         * @param {*} value 
         * @returns 
         */
         physicalDelete:function(){

            var optionStr="";
            
            optionStr+=cont.convert.where();

            var str="DELETE FROM "+topContent.table+optionStr;

            return str;
        },

        /**
         * logicalDelete
         * @param {*} params
         * @returns 
         */
        logicalDelete:function(params){

            var updateListStr="";
            var optionStr="";

            var colum=Object.keys(params);
            for(var n=0;n<colum.length;n++){
                var field=colum[n];
                var value=params[field];

                if(n!=0){
                    updateListStr+=", ";
                }

                if(value === null){
                    updateListStr+=field+" = NULL";
                }
                else{
                    updateListStr+=field+" = "+cont._s(value);
                }
            }

            optionStr+=cont.convert.where();

            var str="UPDATE "+topContent.table+" SET "+updateListStr+optionStr;

            return str;
        },

    };

    /**
     * convert
     */
    this.convert={

        /**
         * field
         * @returns 
         */
        field:function(){

            var str="";

            if(!_buffer.field.length){
                return "*";
            }

            for(var n=0;n<_buffer.field.length;n++){
                if(n!=0){
                    str+=", ";
                }
                var f_=_buffer.field[n];
                str+=f_;
            }

            return str;

        },

        /**
         * where
         * @returns 
         */
        where:function(){

            if(!_buffer.where.length){
                return "";
            }

            var str=" WHERE ";

            var nowIndex=0;

            for(var n=0;n<_buffer.where.length;n++){

                var row=_buffer.where[n];

                if(row.index==undefined){
                    row.index=0;
                }
                
                if(nowIndex > row.index){
                    for(var n2=0;n2<nowIndex-row.index;n2++){
                        str+=" ) ";
                    }
                }

                if(n!=0){
                    str+=" "+row.logicalOperand+" ";
                }

                if(nowIndex < row.index){
                    str+=" ( ";
                }

                if(row.value){
                        if(typeof row.value=="object"){
                            var valuesStr="";
                            for(var n2=0;n2<row.value.length;n2++){
                                if(n2!=0){
                                    valuesStr+=",";
                                }
                                var v_=row.value[n2];
                                valuesStr+=cont._s(v_);
                            }
                            str+=row.field+" "+row.operand+" ("+valuesStr+")";    
                        }
                        else{
                            str+=row.field+" "+row.operand+" "+cont._s(row.value);
                        }
                }
                else{

                    if(row.value===undefined){
                        str+=row.field+" "+row.operand;
                    }
                    else{

                        if(row.value===null){
                            row.value="NULL";
                        }
                        else if(row.value===""){
                            row.value="\"\"";
                        }
                        else if(row.value===0){
                            row.value="0";
                        }

                        str+=row.field+" "+row.operand+" "+row.value;
                    }
                }

                nowIndex=row.index;
            }

            if(nowIndex!=0){
                for(var n=0;n<nowIndex;n++){
                    str+=" ) ";
                }
            }

            return str;
        },

        /**
         * limit
         * @returns 
         */
        limit:function(){

            var str="";

            if(_buffer.limit){
                str+=" LIMIT "+_buffer.limit;
                if(_buffer.offset){
                    str+=", "+_buffer.offset;
                }
            }

            return str;
        },

        /**
         * orderBy
         * @returns 
         */
        orderBy:function(){

            if(!_buffer.orderBy.length){
                return "";
            }

            var str=" ORDER BY ";

            for(var n=0;n<_buffer.orderBy.length;n++){
                var row=_buffer.orderBy[n];

                if(n!=0){
                    str+=", ";
                }
                str+=row.field+" "+row.sort;
            }

            return str;
        },

        /**
         * groupBy
         * @returns 
         */
        groupBy:function(){

            if(!_buffer.groupBy.length){
                return "";
            }

            var str=" GROUP BY ";

            for(var n=0;n<_buffer.groupBy.length;n++){
                var row=_buffer.groupBy[n];

                if(n!=0){
                    str+=", ";
                }
                str+=row;
            }

            return str;
        },
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

    this.clearBuffer=function(){
        _buffer={
            field:[],
            where:[],
            limit:null,
            offset:null,
            orderBy:[],
            groupBy:[],            
        };
    }

};
module.exports = OrmSqlBuilder;