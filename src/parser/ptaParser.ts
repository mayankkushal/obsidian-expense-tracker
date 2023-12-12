import { moment } from "obsidian";
import { Controller } from "src/models/controller";
import { Entry, Transaction } from "src/models/transaction";
import grammar from "src/parser/ptaGrammer/ptaGrammar.ohm-bundle";

export const parser = (code: string) => {
	const controller = new Controller();

	const semantics = grammar.createSemantics();

	semantics.addOperation("parse()", {
		Block(_) {
			this.children.forEach((c) => {
				switch (c.ctorName) {
					case "transaction":
						controller.addTransaction(c.parse());
						break;
				}
			});
		},
		transaction(date, description, entry) {
			return new Transaction(
				date.parse(),
				description.parse(),
				entry.children.map((c: any) => c.parse())
			);
		},
		description(_, arg1, body, arg2) {
			return body.sourceString;
		},
		slashDate(arg0, arg1, arg2, arg3, arg4) {
			return moment(this.sourceString, "YYYY/MM/DD").toDate();
		},
		dashDate(arg0, arg1, arg2, arg3, arg4) {
			return moment(this.sourceString, "YYYY-MM-DD").toDate();
		},
		entry(_, account, price) {
			let parsedPrice = price.children.map((s: any) => s.parse());
			if (parsedPrice.length) {
				parsedPrice = parsedPrice[0];
			}
			const { amount, currency } = (parsedPrice as any) ?? {};
			return new Entry(account.parse(), amount, currency);
		},
		account(mainAccount, subAccount) {
			return (
				mainAccount.sourceString +
				subAccount.children.map((s: any) => s.sourceString).join("")
			);
		},
		price(_, amount, currency) {
			return { amount: amount.parse(), currency: currency.parse() };
		},
		positiveAmount(_) {
			return parseFloat(this.sourceString);
		},
		negativeAmount(_, amount) {
			return -parseFloat(amount.sourceString);
		},
		currency(_) {
			return this.sourceString;
		},
		_iter(...children) {
			children.forEach((c) => c.parse());
		},
	});

	const matchResult = grammar.match(code);
	if (matchResult.failed()) {
		throw new Error(matchResult.message);
	}
	semantics(matchResult).parse();
	return controller;
};
