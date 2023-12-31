import { IterationNode } from "ohm-js";
import {
	BalanceQuery,
	Exclude,
	Filter,
	TransactionQuery,
} from "src/models/query";
import grammar from "./ptaLangGrammar/ptaLangGrammar.ohm-bundle";

export const parser = (code: string) => {
	const semantics = grammar.createSemantics();

	const getFromIterationNode = <T>(
		node: IterationNode
	): T | undefined | null => {
		let parsedNode: any = node.children.map((c) => c.parse());
		if (parsedNode.length) {
			parsedNode = parsedNode[0];
		}
		return parsedNode;
	};

	semantics.addOperation("parse()", {
		Query(selectKey, filters, excludes): any {
			switch (selectKey.parse()) {
				case "balance":
					return new BalanceQuery(
						filters.children.map((c: any) => c.parse()),
						excludes.children.map((c: any) => c.parse())
					);
				case "transaction":
					return new TransactionQuery(
						filters.children.map((c: any) => c.parse()),
						excludes.children.map((c: any) => c.parse())
					);
			}
		},
		SelectKey(_) {
			return this.sourceString;
		},
		FilterClause(filterKey, operator, identifier) {
			return new Filter(
				filterKey.parse(),
				getFromIterationNode<string>(operator) || "",
				getFromIterationNode<string>(identifier) || ""
			);
		},
		ExcludeClause(keyword, excludeKey, operator, identifier) {
			return new Exclude(
				excludeKey.parse(),
				getFromIterationNode<string>(operator) || "",
				getFromIterationNode<string>(identifier) || ""
			);
		},
		identifier(arg0) {
			return this.sourceString;
		},
		_terminal() {
			return this.sourceString;
		},
	});

	const matchResult = grammar.match(code);
	if (matchResult.failed()) {
		throw new Error(matchResult.message);
	}
	return semantics(matchResult).parse();
};
