import { formatDate } from "src/utils/common";
import { Entry, Transaction } from "./transaction";

export class RepeatClause {
	interval: number;
	frequency: string;
	end?: Date;

	constructor(interval: string | number = 1, frequency: string, end?: Date) {
		if (typeof interval === "string") {
			this.interval = parseFloat(interval);
		} else {
			this.interval = interval;
		}
		this.frequency = frequency;
		this.end = end;
	}
}

export class RecEvent {
	date: Date;
	id: string;
	isCreated = false;
	isEnded = false;

	constructor(
		date: Date,
		id: string,
		extraArgs: { key?: string; isCreated?: boolean; isEnded?: boolean }
	) {
		this.date = date;
		this.id = id;

		const { key, isCreated, isEnded } = extraArgs;

		if (isCreated) {
			this.isCreated = true;
		}
		if (isEnded) {
			this.isEnded = true;
		}

		if (key) {
			if (key == "created") {
				this.isCreated = true;
			} else if (key == "ended") {
				this.isEnded = true;
			}
		}
	}

	static format(date: Date, description: string) {
		return `${formatDate(date)} created "${description}"`;
	}
}

export class RecurringTransaction extends Transaction {
	clause: RepeatClause;
	transactionCreated: RecEvent[] = [];
	isEnded = false;
	endEvent?: RecEvent;

	constructor(
		date: Date,
		repeatClause: RepeatClause,
		description: string,
		entries: Entry[]
	) {
		super(date, description, entries);
		this.clause = repeatClause;
	}

	getLastCreatedDate() {
		return this.getLastCreatedTransaction()?.date;
	}

	getLastCreatedTransaction(): RecEvent | undefined {
		return this.transactionCreated[this.transactionCreated.length - 1];
	}

	shouldCreateTransaction(currentDate: Date) {
		const { clause, date } = this; // Access directly from the class
		const { interval, frequency, end } = clause;

		const workingDate = this.getLastCreatedDate() || date;

		// Check if the transaction has already ended
		if (end && end < currentDate) {
			return false;
		}

		// Calculate the next occurrence date based on the frequency and interval
		let nextOccurrenceDate = this.getNextOccurrenceDate(
			workingDate,
			frequency,
			interval
		);

		// Check if today is exactly the next occurrence date
		return {
			shouldCreate:
				currentDate.getDate() === nextOccurrenceDate.getDate() &&
				currentDate.getMonth() === nextOccurrenceDate.getMonth() &&
				currentDate.getFullYear() === nextOccurrenceDate.getFullYear(),
			nextOccurrenceDate,
		};
	}

	getNextOccurrenceDate(
		date: Date,
		frequency: string,
		interval: number
	): Date {
		switch (frequency) {
			case "day":
				return new Date(
					date.getFullYear(),
					date.getMonth(),
					date.getDate() + interval
				);
			case "week":
				return new Date(
					date.getFullYear(),
					date.getMonth(),
					date.getDate() + 7 * interval
				);
			case "month":
				return new Date(
					date.getFullYear(),
					date.getMonth() + interval,
					1
				); // Set day to 1 to avoid month overflow
			case "year":
				return new Date(date.getFullYear() + interval, 1, 1); // Set month and day to 1 for consistent yearly calculations
			default:
				throw new Error(`Invalid frequency: ${frequency}`);
		}
	}

	addRecEvent(recEvent: RecEvent) {
		// add the created or ended date in at the end in a sorted order
		if (recEvent.isCreated) {
			this.transactionCreated.push(recEvent);
			this.transactionCreated.sort((a, b) => {
				return a.date.getTime() - b.date.getTime();
			});
		} else if (recEvent.isEnded) {
			this.isEnded = true;
			this.endEvent = recEvent;
		}
	}

	formatTransaction(
		currency: string,
		date?: Date,
		description?: string
	): string {
		const finalDate = date || this.date;
		const finalDescription = description || this.description;

		let output = `\n${formatDate(finalDate)} "${finalDescription}"\n`;

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

	format(currency: string, date?: Date, description?: string): string {
		const finalDate = date || this.date;
		const finalDescription = description || this.description;

		let output = `\n${formatDate(finalDate)} repeat ${
			this.clause.interval || ""
		} ${this.clause.frequency} ${
			this.clause.end ?? ""
		} "${finalDescription}"\n`;

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
