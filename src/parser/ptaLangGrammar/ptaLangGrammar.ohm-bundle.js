'use strict';const {makeRecipe}=require('ohm-js');const result=makeRecipe(["grammar",{"source":"PTALang {\n\tQuery = SelectKey FilterClause*\n    \n    FilterClause = FilterKey Operator? identifier?\n    \n    SelectKey = BALANCE | TRANSACTION\n    FilterKey = ACCOUNT | DATE | STRUCTURE | LIMIT | ORDER\n    \n    Operator = eq | lt | gt | lte | gte | neq | multiple | exclude | current | last | first | desc | asc\n    \n    BALANCE     = \"balance\"\n  TRANSACTION = \"transaction\"\n  AND         = \"and\"\n  OR          = \"or\"\n  ACCOUNT = \"account\"\n  DATE = \"date\"\n  STRUCTURE = \"structure\"\n  LIMIT = \"limit\"\n  ORDER = \"order\"\n  // Identifier (table or column names)\n  identifier  = (~newline any)*\n  // Literals\n  string      = \"\\\"\" (~\"\\\"\" any)* \"\\\"\"\n  number      = digit+\n  // Operators\n  eq          = \"=\"\n  neq         = \"!=\"\n  lt          = \"<\"\n  gt          = \">\"\n  lte         = \"<=\"\n  gte         = \">=\"\n  multiple    = \"multiple\"\n  exclude     = \"exclude\"\n  current     = \"current\"\n  last        = \"last\"\n  first       = \"first\"\n  desc        = \"desc\"\n  asc         = \"asc\"\n  // Punctuation\n  comma       = \",\"\n  colon       = \":\"\n  semicolon   = \";\"\n  newline     = \"\\n\"\n\n}"},"PTALang",null,"Query",{"Query":["define",{"sourceInterval":[11,42]},null,[],["seq",{"sourceInterval":[19,42]},["app",{"sourceInterval":[19,28]},"SelectKey",[]],["star",{"sourceInterval":[29,42]},["app",{"sourceInterval":[29,41]},"FilterClause",[]]]]],"FilterClause":["define",{"sourceInterval":[52,98]},null,[],["seq",{"sourceInterval":[67,98]},["app",{"sourceInterval":[67,76]},"FilterKey",[]],["opt",{"sourceInterval":[77,86]},["app",{"sourceInterval":[77,85]},"Operator",[]]],["opt",{"sourceInterval":[87,98]},["app",{"sourceInterval":[87,97]},"identifier",[]]]]],"SelectKey":["define",{"sourceInterval":[108,141]},null,[],["alt",{"sourceInterval":[120,141]},["app",{"sourceInterval":[120,127]},"BALANCE",[]],["app",{"sourceInterval":[130,141]},"TRANSACTION",[]]]],"FilterKey":["define",{"sourceInterval":[146,200]},null,[],["alt",{"sourceInterval":[158,200]},["app",{"sourceInterval":[158,165]},"ACCOUNT",[]],["app",{"sourceInterval":[168,172]},"DATE",[]],["app",{"sourceInterval":[175,184]},"STRUCTURE",[]],["app",{"sourceInterval":[187,192]},"LIMIT",[]],["app",{"sourceInterval":[195,200]},"ORDER",[]]]],"Operator":["define",{"sourceInterval":[210,310]},null,[],["alt",{"sourceInterval":[221,310]},["app",{"sourceInterval":[221,223]},"eq",[]],["app",{"sourceInterval":[226,228]},"lt",[]],["app",{"sourceInterval":[231,233]},"gt",[]],["app",{"sourceInterval":[236,239]},"lte",[]],["app",{"sourceInterval":[242,245]},"gte",[]],["app",{"sourceInterval":[248,251]},"neq",[]],["app",{"sourceInterval":[254,262]},"multiple",[]],["app",{"sourceInterval":[265,272]},"exclude",[]],["app",{"sourceInterval":[275,282]},"current",[]],["app",{"sourceInterval":[285,289]},"last",[]],["app",{"sourceInterval":[292,297]},"first",[]],["app",{"sourceInterval":[300,304]},"desc",[]],["app",{"sourceInterval":[307,310]},"asc",[]]]],"BALANCE":["define",{"sourceInterval":[320,343]},null,[],["terminal",{"sourceInterval":[334,343]},"balance"]],"TRANSACTION":["define",{"sourceInterval":[346,373]},null,[],["terminal",{"sourceInterval":[360,373]},"transaction"]],"AND":["define",{"sourceInterval":[376,395]},null,[],["terminal",{"sourceInterval":[390,395]},"and"]],"OR":["define",{"sourceInterval":[398,416]},null,[],["terminal",{"sourceInterval":[412,416]},"or"]],"ACCOUNT":["define",{"sourceInterval":[419,438]},null,[],["terminal",{"sourceInterval":[429,438]},"account"]],"DATE":["define",{"sourceInterval":[441,454]},null,[],["terminal",{"sourceInterval":[448,454]},"date"]],"STRUCTURE":["define",{"sourceInterval":[457,480]},null,[],["terminal",{"sourceInterval":[469,480]},"structure"]],"LIMIT":["define",{"sourceInterval":[483,498]},null,[],["terminal",{"sourceInterval":[491,498]},"limit"]],"ORDER":["define",{"sourceInterval":[501,516]},null,[],["terminal",{"sourceInterval":[509,516]},"order"]],"identifier":["define",{"sourceInterval":[559,588]},null,[],["star",{"sourceInterval":[573,588]},["seq",{"sourceInterval":[574,586]},["not",{"sourceInterval":[574,582]},["app",{"sourceInterval":[575,582]},"newline",[]]],["app",{"sourceInterval":[583,586]},"any",[]]]]],"string":["define",{"sourceInterval":[605,641]},null,[],["seq",{"sourceInterval":[619,641]},["terminal",{"sourceInterval":[619,623]},"\""],["star",{"sourceInterval":[624,636]},["seq",{"sourceInterval":[625,634]},["not",{"sourceInterval":[625,630]},["terminal",{"sourceInterval":[626,630]},"\""]],["app",{"sourceInterval":[631,634]},"any",[]]]],["terminal",{"sourceInterval":[637,641]},"\""]]],"number":["define",{"sourceInterval":[644,664]},null,[],["plus",{"sourceInterval":[658,664]},["app",{"sourceInterval":[658,663]},"digit",[]]]],"eq":["define",{"sourceInterval":[682,699]},null,[],["terminal",{"sourceInterval":[696,699]},"="]],"neq":["define",{"sourceInterval":[702,720]},null,[],["terminal",{"sourceInterval":[716,720]},"!="]],"lt":["define",{"sourceInterval":[723,740]},null,[],["terminal",{"sourceInterval":[737,740]},"<"]],"gt":["define",{"sourceInterval":[743,760]},null,[],["terminal",{"sourceInterval":[757,760]},">"]],"lte":["define",{"sourceInterval":[763,781]},null,[],["terminal",{"sourceInterval":[777,781]},"<="]],"gte":["define",{"sourceInterval":[784,802]},null,[],["terminal",{"sourceInterval":[798,802]},">="]],"multiple":["define",{"sourceInterval":[805,829]},null,[],["terminal",{"sourceInterval":[819,829]},"multiple"]],"exclude":["define",{"sourceInterval":[832,855]},null,[],["terminal",{"sourceInterval":[846,855]},"exclude"]],"current":["define",{"sourceInterval":[858,881]},null,[],["terminal",{"sourceInterval":[872,881]},"current"]],"last":["define",{"sourceInterval":[884,904]},null,[],["terminal",{"sourceInterval":[898,904]},"last"]],"first":["define",{"sourceInterval":[907,928]},null,[],["terminal",{"sourceInterval":[921,928]},"first"]],"desc":["define",{"sourceInterval":[931,951]},null,[],["terminal",{"sourceInterval":[945,951]},"desc"]],"asc":["define",{"sourceInterval":[954,973]},null,[],["terminal",{"sourceInterval":[968,973]},"asc"]],"comma":["define",{"sourceInterval":[993,1010]},null,[],["terminal",{"sourceInterval":[1007,1010]},","]],"colon":["define",{"sourceInterval":[1013,1030]},null,[],["terminal",{"sourceInterval":[1027,1030]},":"]],"semicolon":["define",{"sourceInterval":[1033,1050]},null,[],["terminal",{"sourceInterval":[1047,1050]},";"]],"newline":["define",{"sourceInterval":[1053,1071]},null,[],["terminal",{"sourceInterval":[1067,1071]},"\n"]]}]);module.exports=result;