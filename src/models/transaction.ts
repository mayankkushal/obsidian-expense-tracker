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
	description: string;
	entries: Entry[];
	toTotal: number;
	currency: string;

	constructor(date: Date, description: string, entries: Entry[]) {
		this.date = date;
		this.description = description;
		this.entries = entries;

		this._validate();
	}

	private _validate() {
		this.validateEntriesAmount();
		this._fillAmount();
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
}
