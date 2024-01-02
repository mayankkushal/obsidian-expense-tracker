import { IterationNode } from "ohm-js";
import { Controller } from "src/models/controller";
import {
	RecEvent,
	RecurringTransaction,
	RepeatClause,
} from "src/models/recurring";
import { Entry, Transaction } from "src/models/transaction";
import grammar from "src/parser/ptaGrammer/ptaGrammar.ohm-bundle";

export const parser = (code: string) => {
	const controller = new Controller();

	const semantics = grammar.createSemantics();

	const getFromIterationNode = <T>(node: IterationNode): T | undefined => {
		// /skip - this makes sense logically
		let parsedNode: any = node.children.map((c) => c.parse());
		if (parsedNode.length) {
			parsedNode = parsedNode[0];
		}
		return parsedNode;
	};

	semantics.addOperation("parse()", {
		Block(_) {
			this.children.forEach((c) => {
				switch (c.ctorName) {
					case "Transaction":
						controller.addTransaction(c.parse());
						break;
					case "Recurring":
						controller.addRecurringTransaction(c.parse());
						break;
					case "RecEvent":
						controller.addRecEvent(c.parse());
						break;
				}
			});
		},
		Transaction(date, description, entry) {
			return new Transaction(
				date.parse(),
				description.parse(),
				entry.children.map((c) => c.parse())
			);
		},
		Recurring(date, key, repeatClause, description, entry) {
			return new RecurringTransaction(
				date.parse(),
				repeatClause.parse(),
				description.parse(),
				entry.children.map((c) => c.parse())
			);
		},
		RecEvent(date, key, description) {
			return new RecEvent(date.parse(), description.parse(), {
				key: key.sourceString,
			});
		},
		RepeatClause(interval, frequency, end) {
			return new RepeatClause(
				getFromIterationNode<string>(interval),
				frequency.sourceString,
				getFromIterationNode(end)
			);
		},
		Date(arg0, arg1, arg2, arg3, arg4) {
			return new Date(this.sourceString);
		},
		Description(_, body, __) {
			return body.sourceString;
		},
		Entry(account, price) {
			let parsedPrice = getFromIterationNode<{
				amount: number;
				currency: string;
			}>(price);
			const { amount, currency } = parsedPrice ?? {};
			return new Entry(account.parse(), amount, currency);
		},
		Account(mainAccount, subAccount) {
			return (
				mainAccount.sourceString +
				subAccount.children.map((s) => s.sourceString).join("")
			);
		},
		price(amount, currency) {
			return { amount: amount.parse(), currency: currency.parse() };
		},
		amount(sign, mainAmount, decimalAmount) {
			const parsedSign = getFromIterationNode(sign);
			const parsedDecimalAmount = getFromIterationNode(decimalAmount);
			const parsedMainAmount = mainAmount.sourceString;

			return parseFloat(
				`${parsedSign || ""}${parsedMainAmount || "0"}.${
					parsedDecimalAmount || "0"
				}`
			);
		},
		decimalAmount(arg0, arg1, arg2) {
			return arg1.sourceString + arg2.sourceString;
		},
		currency(_, __, ___) {
			return this.sourceString;
		},
		_iter(...children) {
			children.forEach((c) => c.parse());
		},
		_terminal() {
			return this.sourceString;
		},
	});

	const matchResult = grammar.match(code);
	if (matchResult.failed()) {
		throw new Error(matchResult.message);
	}
	semantics(matchResult).parse();
	return controller;
};
