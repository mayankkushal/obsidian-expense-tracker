import { Transaction } from "./transaction";

export class Account {
	name: string;
	path: string;
	children: Account[];
	balance: number;
	creationDate: Date;
	root: boolean;

	constructor(
		name: string,
		creationDate: Date,
		path: string,
		initialBalance: number = 0,
		root: boolean = false
	) {
		this.name = name;
		this.children = [];
		this.balance = initialBalance;
		this.creationDate = creationDate;
		this.path = path;
		this.root = root;
	}

	addChildAccount(child: Account) {
		this.children.push(child);
	}

	updateBalance(amount: number) {
		this.balance += amount;
	}

	getBalance(transactions?: Transaction[]): number {
		// Calculate the balance by summing the amounts from transactions
		if (transactions === undefined) {
			return this.balance;
		}
		return transactions.reduce((balance, transaction) => {
			const entry = transaction.entries.find(
				(entry) => entry.accountName === this.name
			);
			return balance + (entry?.amount || 0);
		}, 0);
	}
}

export class AccountHierarchy {
	accountIndex: { [key: string]: Account };

	constructor() {
		this.accountIndex = {};
	}

	addAccount(
		accountName: string,
		amount: number = 0,
		creationDate: Date = new Date()
	) {
		const accountNames = accountName.split(":");
		let currentPath = "";
		let currentNode: Account | undefined;

		accountNames.forEach((namePart, index) => {
			if (index == 0) {
				currentPath = namePart;
			} else {
				currentPath += `:${namePart}`;
			}

			if (currentPath in this.accountIndex) {
				currentNode = this.accountIndex[currentPath]!;
				// Update balance for the current account
				currentNode.updateBalance(amount);
			} else {
				const newChild = new Account(
					namePart,
					creationDate,
					currentPath,
					amount
				);

				if (currentNode) {
					currentNode.addChildAccount(newChild);
				} else {
					newChild.root = true;
				}

				currentNode = newChild;

				// Update the index
				this.accountIndex[currentPath] = currentNode;
			}
		});
	}

	getAccountByName(accountName: string): Account | undefined {
		return this.accountIndex[accountName];
	}
}
