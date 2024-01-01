import { formatDate } from "src/utils/common";

export class Entry {
	accountName: string;
	amount?: number;
	currency?: string;

	constructor(accountName: string, amount?: number, currency?: string) {
		this.accountName = accountName;
		this.amount = amount;
		this.currency = currency;
	}

	setPrice(amount: number, currency: string) {
		this.amount = amount;
		this.currency = currency;
	}
}

export class Transaction {
	date: Date;
	description?: string;
	entries: Entry[];
	toTotal: number;
	currency: string;

	constructor(date: Date, description: string | undefined, entries: Entry[]) {
		this.date = date;
		this.description = description;
		this.entries = entries;

		this._validate();

		this.getToTotal();

		this._fillAmount();
	}

	private _validate() {
		this.validateEntriesAmount();
	}

	private _fillAmount() {
		const lastEntry = this.entries[this.entries.length - 1];

		if (lastEntry.amount === undefined) {
			lastEntry.setPrice(-this.getToTotal(), this.currency);
		}
	}

	private validateEntriesAmount() {
		const arrayLength = this.entries.length;

		let commonCurrency: string | undefined;

		if (arrayLength === 0) {
			throw new Error("Array is empty. At least one object is required.");
		}

		for (let i = 0; i < arrayLength - 1; i++) {
			const currentObject = this.entries[i];

			if (currentObject.amount === undefined) {
				throw new Error(`Amount is required ${this}`);
			}

			if (currentObject.currency !== undefined) {
				if (commonCurrency === undefined) {
					commonCurrency = currentObject.currency;
				} else if (currentObject.currency !== commonCurrency) {
					throw new Error(`Currencies are not consistent ${this}`);
				}
			}
		}

		if (arrayLength === 1 && this.entries[0].amount === undefined) {
			throw new Error(`Amount is required ${this}`);
		}
	}

	static buildEntries(
		entries: { account: string; amount?: number; currency?: string }[]
	) {
		return entries.map(
			(entry) => new Entry(entry.account, entry.amount, entry.currency)
		);
	}

	getToTotal() {
		if (this.toTotal !== undefined) {
			return this.toTotal;
		}

		const total = this.entries.reduce((sum, entry) => {
			if (entry.amount && entry.amount > 0) {
				return sum + entry.amount;
			}
			return sum;
		}, 0);

		this.toTotal = total;
		return this.toTotal;
	}

	formatDescription(description?: string) {
		if (description) {
			return `"${description}"`;
		}
		return '""';
	}

	format(currency: string, date?: Date, description?: string): string {
		const finalDate = date || this.date;
		const finalDescription = description || this.description;

		let output = `\n${formatDate(finalDate)} ${this.formatDescription(
			finalDescription
		)}\n`;

		for (const { accountName, amount } of this.entries) {
			if (accountName) {
				output += `${accountName}`;

				if (amount) {
					output += ` ${amount}${currency}`;
				}
			}
			output += "\n";
		}

		return output;
	}
}
