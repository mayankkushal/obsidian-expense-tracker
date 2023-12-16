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

export class TransactionCreated {
	date: Date;
	id: string;

	constructor(date: Date, id: string) {
		this.date = date;
		this.id = id;
	}

	static format(date: Date, description: string) {
		return `${formatDate(date)} created "${description}"`;
	}
}

export class RecurringTransaction extends Transaction {
	clause: RepeatClause;
	transactionCreated: TransactionCreated[] = [];

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

	getLastCreatedTransaction(): TransactionCreated | undefined {
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

	addTransactionCreated(transactionCreated: TransactionCreated) {
		// add the created date in at the end in a sorted order
		this.transactionCreated.push(transactionCreated);
		this.transactionCreated.sort((a, b) => {
			return a.date.getTime() - b.date.getTime();
		});
	}
}
