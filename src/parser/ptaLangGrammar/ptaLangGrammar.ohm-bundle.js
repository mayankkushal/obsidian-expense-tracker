'use strict';const {makeRecipe}=require('ohm-js');const result=makeRecipe(["grammar",{"source":"PTALang {\n\tQuery = SelectKey FilterClause*\n    \n    FilterClause = FilterKey Operator? identifier?\n    \n    SelectKey = BALANCE | TRANSACTION\n    FilterKey = ACCOUNT | DATE | STRUCTURE\n    \n    Operator = eq | lt | gt | lte | gte | neq | multiple | exclude | current | last\n    \n    BALANCE     = \"balance\"\n  TRANSACTION = \"transaction\"\n  AND         = \"and\"\n  OR          = \"or\"\n  ACCOUNT = \"account\"\n  DATE = \"date\"\n  STRUCTURE = \"structure\"\n  // Identifier (table or column names)\n  identifier  = (~newline any)*\n  // Literals\n  string      = \"\\\"\" (~\"\\\"\" any)* \"\\\"\"\n  number      = digit+\n  // Operators\n  eq          = \"=\"\n  neq         = \"!=\"\n  lt          = \"<\"\n  gt          = \">\"\n  lte         = \"<=\"\n  gte         = \">=\"\n  multiple    = \"multiple\"\n  exclude     = \"exclude\"\n  current     = \"current\"\n  last        = \"last\"\n  // Punctuation\n  comma       = \",\"\n  colon       = \":\"\n  semicolon   = \";\"\n  newline     = \"\\n\"\n\n}"},"PTALang",null,"Query",{"Query":["define",{"sourceInterval":[11,42]},null,[],["seq",{"sourceInterval":[19,42]},["app",{"sourceInterval":[19,28]},"SelectKey",[]],["star",{"sourceInterval":[29,42]},["app",{"sourceInterval":[29,41]},"FilterClause",[]]]]],"FilterClause":["define",{"sourceInterval":[52,98]},null,[],["seq",{"sourceInterval":[67,98]},["app",{"sourceInterval":[67,76]},"FilterKey",[]],["opt",{"sourceInterval":[77,86]},["app",{"sourceInterval":[77,85]},"Operator",[]]],["opt",{"sourceInterval":[87,98]},["app",{"sourceInterval":[87,97]},"identifier",[]]]]],"SelectKey":["define",{"sourceInterval":[108,141]},null,[],["alt",{"sourceInterval":[120,141]},["app",{"sourceInterval":[120,127]},"BALANCE",[]],["app",{"sourceInterval":[130,141]},"TRANSACTION",[]]]],"FilterKey":["define",{"sourceInterval":[146,184]},null,[],["alt",{"sourceInterval":[158,184]},["app",{"sourceInterval":[158,165]},"ACCOUNT",[]],["app",{"sourceInterval":[168,172]},"DATE",[]],["app",{"sourceInterval":[175,184]},"STRUCTURE",[]]]],"Operator":["define",{"sourceInterval":[194,273]},null,[],["alt",{"sourceInterval":[205,273]},["app",{"sourceInterval":[205,207]},"eq",[]],["app",{"sourceInterval":[210,212]},"lt",[]],["app",{"sourceInterval":[215,217]},"gt",[]],["app",{"sourceInterval":[220,223]},"lte",[]],["app",{"sourceInterval":[226,229]},"gte",[]],["app",{"sourceInterval":[232,235]},"neq",[]],["app",{"sourceInterval":[238,246]},"multiple",[]],["app",{"sourceInterval":[249,256]},"exclude",[]],["app",{"sourceInterval":[259,266]},"current",[]],["app",{"sourceInterval":[269,273]},"last",[]]]],"BALANCE":["define",{"sourceInterval":[283,306]},null,[],["terminal",{"sourceInterval":[297,306]},"balance"]],"TRANSACTION":["define",{"sourceInterval":[309,336]},null,[],["terminal",{"sourceInterval":[323,336]},"transaction"]],"AND":["define",{"sourceInterval":[339,358]},null,[],["terminal",{"sourceInterval":[353,358]},"and"]],"OR":["define",{"sourceInterval":[361,379]},null,[],["terminal",{"sourceInterval":[375,379]},"or"]],"ACCOUNT":["define",{"sourceInterval":[382,401]},null,[],["terminal",{"sourceInterval":[392,401]},"account"]],"DATE":["define",{"sourceInterval":[404,417]},null,[],["terminal",{"sourceInterval":[411,417]},"date"]],"STRUCTURE":["define",{"sourceInterval":[420,443]},null,[],["terminal",{"sourceInterval":[432,443]},"structure"]],"identifier":["define",{"sourceInterval":[486,515]},null,[],["star",{"sourceInterval":[500,515]},["seq",{"sourceInterval":[501,513]},["not",{"sourceInterval":[501,509]},["app",{"sourceInterval":[502,509]},"newline",[]]],["app",{"sourceInterval":[510,513]},"any",[]]]]],"string":["define",{"sourceInterval":[532,568]},null,[],["seq",{"sourceInterval":[546,568]},["terminal",{"sourceInterval":[546,550]},"\""],["star",{"sourceInterval":[551,563]},["seq",{"sourceInterval":[552,561]},["not",{"sourceInterval":[552,557]},["terminal",{"sourceInterval":[553,557]},"\""]],["app",{"sourceInterval":[558,561]},"any",[]]]],["terminal",{"sourceInterval":[564,568]},"\""]]],"number":["define",{"sourceInterval":[571,591]},null,[],["plus",{"sourceInterval":[585,591]},["app",{"sourceInterval":[585,590]},"digit",[]]]],"eq":["define",{"sourceInterval":[609,626]},null,[],["terminal",{"sourceInterval":[623,626]},"="]],"neq":["define",{"sourceInterval":[629,647]},null,[],["terminal",{"sourceInterval":[643,647]},"!="]],"lt":["define",{"sourceInterval":[650,667]},null,[],["terminal",{"sourceInterval":[664,667]},"<"]],"gt":["define",{"sourceInterval":[670,687]},null,[],["terminal",{"sourceInterval":[684,687]},">"]],"lte":["define",{"sourceInterval":[690,708]},null,[],["terminal",{"sourceInterval":[704,708]},"<="]],"gte":["define",{"sourceInterval":[711,729]},null,[],["terminal",{"sourceInterval":[725,729]},">="]],"multiple":["define",{"sourceInterval":[732,756]},null,[],["terminal",{"sourceInterval":[746,756]},"multiple"]],"exclude":["define",{"sourceInterval":[759,782]},null,[],["terminal",{"sourceInterval":[773,782]},"exclude"]],"current":["define",{"sourceInterval":[785,808]},null,[],["terminal",{"sourceInterval":[799,808]},"current"]],"last":["define",{"sourceInterval":[811,831]},null,[],["terminal",{"sourceInterval":[825,831]},"last"]],"comma":["define",{"sourceInterval":[851,868]},null,[],["terminal",{"sourceInterval":[865,868]},","]],"colon":["define",{"sourceInterval":[871,888]},null,[],["terminal",{"sourceInterval":[885,888]},":"]],"semicolon":["define",{"sourceInterval":[891,908]},null,[],["terminal",{"sourceInterval":[905,908]},";"]],"newline":["define",{"sourceInterval":[911,929]},null,[],["terminal",{"sourceInterval":[925,929]},"\n"]]}]);module.exports=result;