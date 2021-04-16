const OrmSqlBuilder = function(context,topContent){

    var _buffer={
        field:[],
        where:[],
        limit:null,
        offset:null,
        orderBy:[],
        groupBy:[],
    };

    var cont=this;

    this.where=function(field,operand,value,index,logicalOperand){

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

    this.whereAnd=function(field,operand,value,index){

        _buffer.where.push({
            field:field,
            operand:operand,
            value:value,
            logicalOperand:"AND",
            index:index,
        });
    };

    this.whereOr=function(field,operand,value,index){

        _buffer.where.push({
            field:field,
            operand:operand,
            value:value,
            logicalOperand:"OR",
            index:index,
        });
    };


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

    this.limit=function(limit,offset){
        
        _buffer.limit=limit;

        if(offset){
            _buffer.offset=offset;
        }
        else{
            _buffer.offset=null;
        }
    };

    this.orderBy=function(field,sort){

        _buffer.orderBy.push({
            field:field,
            sort:sort,
        });
    };

    this.groupBy=function(field){
        _buffer.groupBy.push(field);
    };

    this.distinct=function(status){
        _buffer.distinct=status;
    }

    this.build={

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

        insert:function(){


        },

        update:function(){


        },
        
        delete:function(){

        },

    };

    this.convert={

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

                console.log(nowIndex+"___"+row.index);

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

    this._s=function(string){

        if(typeof string!="string"){
            return string;
        }

        string=string.split("\"").join("\\\"");

        return "\""+string+"\"";
    };

};
module.exports = OrmSqlBuilder;