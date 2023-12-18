import { App, Modal, Plugin, PluginSettingTab, Setting } from "obsidian";
import { parser as ptaLangParser } from "src/parser/ptaLangParser";
import { parser } from "src/parser/ptaParser";
import { PTA } from "./models/pta";
import {
	RecEvent,
	RecurringTransaction,
	RepeatClause,
} from "./models/recurring";
import { Transaction } from "./models/transaction";
import { createTransactionForm } from "./ui/TransactionForm";

interface PtaPluginSettings {
	ledgerPath: string;
	currency: string;
	checkIntervalSec: number;
}

const DEFAULT_SETTINGS: PtaPluginSettings = {
	ledgerPath: "Ledger.md",
	currency: "INR",
	checkIntervalSec: 60 * 60,
};

export default class PtaPlugin extends Plugin {
	settings: PtaPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"receipt",
			"Add Transaction",
			async (evt: MouseEvent) => {
				new TransactionModal(this.app, this).open();
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// Add protocol to open transaction modal
		this.registerObsidianProtocolHandler("simple-pta", () => {
			new TransactionModal(this.app, this).open();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PtaSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor(
			"pta",
			async (source, el, ctx) => {
				const query = ptaLangParser(source.trim());

				const ledgerContent = await new PTA(this).cachedReadLedger();
				const controller = parser(ledgerContent);

				query.setController(controller);
				query.execute(el, this);
			}
		);

		this.registerInterval(
			window.setInterval(
				() => this.handleRecurringTransaction(),
				this.settings.checkIntervalSec * 1000
			)
		);
	}

	async handleRecurringTransaction() {
		const pta = new PTA(this);

		const ledgerContent = await pta.cachedReadLedger();
		const controller = parser(ledgerContent);

		controller.checkRecurringTransactions((transaction, date) => {
			pta.appendContent(
				RecEvent.formatFromInput(date, transaction.description)
			);
			pta.appendContent(
				transaction.formatTransaction(this.settings.currency, date)
			);
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TransactionModal extends Modal {
	plugin: PtaPlugin;

	constructor(app: App, plugin: PtaPlugin) {
		super(app);
		this.plugin = plugin;
	}

	handleFormSubmit = async (
		transactionData?: {
			date: string;
			description?: string;
			isRecurring: boolean;
			interval?: number;
			frequency?: string;
			end?: string;
			accounts: { account?: string; amount?: number }[];
		},
		recEventData?: {
			date: string;
			description: string;
			isCreated: boolean;
			isEnded: boolean;
		}
	) => {
		if (transactionData) {
			await this.handleTransactionData(transactionData);
		}

		if (recEventData) {
			await this.handleRecEventData(recEventData);
		}
	};

	async handleRecEventData(recEventData: {
		date: string;
		description: string;
		isCreated: boolean;
		isEnded: boolean;
	}) {
		const { date, description, isCreated, isEnded } = recEventData;
		const recEvent = new RecEvent(new Date(date), description, {
			isCreated,
			isEnded,
		});
		await new PTA(this.plugin).appendContent(recEvent.format());
	}

	private async handleTransactionData(transactionData: {
		date: string;
		description?: string | undefined;
		isRecurring: boolean;
		interval?: number | undefined;
		frequency?: string | undefined;
		end?: string | undefined;
		accounts: { account?: string; amount?: number }[];
	}) {
		const {
			date,
			description,
			isRecurring,
			interval,
			frequency,
			end,
			accounts,
		} = transactionData;

		let transaction: Transaction | RecurringTransaction;

		if (isRecurring) {
			transaction = new RecurringTransaction(
				new Date(date),
				new RepeatClause(
					interval,
					frequency!,
					end ? new Date(end) : undefined
				),
				description ?? "",
				RecurringTransaction.buildEntries(accounts as any)
			);
		} else {
			transaction = new Transaction(
				new Date(date),
				description ?? "",
				Transaction.buildEntries(accounts as any)
			);
		}

		await new PTA(this.plugin).appendContent(
			transaction.format(this.plugin.settings.currency)
		);
	}

	async onOpen() {
		const { contentEl } = this;
		const ledgerContent = await new PTA(this.plugin).cachedReadLedger();
		const controller = parser(ledgerContent);
		createTransactionForm(
			contentEl,
			this.handleFormSubmit,
			this.app,
			controller
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class PtaSettingTab extends PluginSettingTab {
	plugin: PtaPlugin;

	constructor(app: App, plugin: PtaPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName("Ledger Path").addText((text) =>
			text
				.setPlaceholder("Ledger.md")
				.setValue(this.plugin.settings.ledgerPath)
				.onChange(async (value) => {
					this.plugin.settings.ledgerPath = value;
					await this.plugin.saveSettings();
				})
		);

		new Setting(containerEl).setName("Currency").addText((text) =>
			text
				.setPlaceholder("INR")
				.setValue(this.plugin.settings.currency)
				.onChange(async (value) => {
					this.plugin.settings.currency = value;
					await this.plugin.saveSettings();
				})
		);

		new Setting(containerEl)
			.setName("Check Interval (sec)")
			.addText((text) =>
				text
					.setPlaceholder("3600")
					.setValue(this.plugin.settings.checkIntervalSec.toString())
					.onChange(async (value) => {
						this.plugin.settings.checkIntervalSec = Number(value);
						await this.plugin.saveSettings();
					})
			);
	}
}
