// AUTOGENERATED FILE
// This file was generated from ptaGrammar.ohm by `ohm generateBundles`.

import {
  BaseActionDict,
  Grammar,
  IterationNode,
  Node,
  NonterminalNode,
  Semantics,
  TerminalNode
} from 'ohm-js';

export interface PTAActionDict<T> extends BaseActionDict<T> {
  Program?: (this: NonterminalNode, arg0: IterationNode) => T;
  Block?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  Transaction?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode, arg2: IterationNode) => T;
  Recurring?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode, arg2: NonterminalNode, arg3: NonterminalNode, arg4: IterationNode) => T;
  RecEvent?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode, arg2: NonterminalNode) => T;
  RecEventKey?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  RepeatClause?: (this: NonterminalNode, arg0: IterationNode, arg1: NonterminalNode, arg2: IterationNode) => T;
  RepeatInterval?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  RepeatFrequency?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  RepeatEnd?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  Entry?: (this: NonterminalNode, arg0: NonterminalNode, arg1: IterationNode) => T;
  price?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode) => T;
  amount?: (this: NonterminalNode, arg0: IterationNode, arg1: NonterminalNode, arg2: IterationNode) => T;
  sign?: (this: NonterminalNode, arg0: TerminalNode) => T;
  mainAmount?: (this: NonterminalNode, arg0: IterationNode) => T;
  decimalAmount?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode, arg2: NonterminalNode) => T;
  currency?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode, arg2: NonterminalNode) => T;
  Account?: (this: NonterminalNode, arg0: NonterminalNode, arg1: IterationNode) => T;
  mainAccount?: (this: NonterminalNode, arg0: IterationNode) => T;
  subAccount?: (this: NonterminalNode, arg0: TerminalNode, arg1: IterationNode) => T;
  Description?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode, arg2: NonterminalNode) => T;
  descriptionBody?: (this: NonterminalNode, arg0: IterationNode) => T;
  Date?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode, arg2: NonterminalNode, arg3: NonterminalNode, arg4: NonterminalNode) => T;
  year?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode, arg2: NonterminalNode, arg3: NonterminalNode) => T;
  month?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode) => T;
  day?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode) => T;
  REPEAT?: (this: NonterminalNode, arg0: TerminalNode) => T;
  CREATED?: (this: NonterminalNode, arg0: TerminalNode) => T;
  ENDED?: (this: NonterminalNode, arg0: TerminalNode) => T;
  DAY?: (this: NonterminalNode, arg0: TerminalNode) => T;
  WEEK?: (this: NonterminalNode, arg0: TerminalNode) => T;
  MONTH?: (this: NonterminalNode, arg0: TerminalNode) => T;
  YEAR?: (this: NonterminalNode, arg0: TerminalNode) => T;
  entryDelimiter?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode) => T;
  delimiter?: (this: NonterminalNode, arg0: TerminalNode) => T;
  whitespace?: (this: NonterminalNode, arg0: TerminalNode) => T;
  dash?: (this: NonterminalNode, arg0: TerminalNode) => T;
  newline?: (this: NonterminalNode, arg0: TerminalNode) => T;
  decimal?: (this: NonterminalNode, arg0: TerminalNode) => T;
  comment?: (this: NonterminalNode, arg0: TerminalNode, arg1: IterationNode, arg2: TerminalNode) => T;
  space?: (this: NonterminalNode, arg0: NonterminalNode | TerminalNode) => T;
}

export interface PTASemantics extends Semantics {
  addOperation<T>(name: string, actionDict: PTAActionDict<T>): this;
  extendOperation<T>(name: string, actionDict: PTAActionDict<T>): this;
  addAttribute<T>(name: string, actionDict: PTAActionDict<T>): this;
  extendAttribute<T>(name: string, actionDict: PTAActionDict<T>): this;
}

export interface PTAGrammar extends Grammar {
  createSemantics(): PTASemantics;
  extendSemantics(superSemantics: PTASemantics): PTASemantics;
}

declare const grammar: PTAGrammar;
export default grammar;

