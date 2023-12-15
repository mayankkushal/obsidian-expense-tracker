import { App, Modal, Plugin, PluginSettingTab, Setting } from "obsidian";
import { parser as ptaLangParser } from "src/parser/ptaLangParser";
import { parser } from "src/parser/ptaParser";
import { PTA } from "./models/pta";
import { createTransactionForm } from "./ui/TransactionForm";

interface PtaPluginSettings {
	ledgerPath: string;
	currency: string;
}

const DEFAULT_SETTINGS: PtaPluginSettings = {
	ledgerPath: "Ledger.md",
	currency: "INR",
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
				const { vault } = this.app;

				const ledgerContent = await new PTA(this).cachedReadLedger();
				const controller = parser(ledgerContent);

				query.setController(controller);
				query.execute(el, this);
			}
		);
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

	formatTransaction(
		date: string,
		description: string,
		accounts: { account?: string; amount?: number }[]
	): string {
		let output = `\n${date} "${description}"\n`;

		const { currency } = this.plugin.settings;

		for (const { account, amount } of accounts) {
			if (account) {
				output += `${account}`;

				if (amount) {
					output += ` ${amount}${currency}`;
				}
			}
			output += "\n";
		}

		return output;
	}

	handleFormSubmit = async (
		date: string,
		description: string,
		accounts: { account?: string; amount?: number }[]
	) => {
		await new PTA(this.plugin).appendContent(
			this.formatTransaction(date, description, accounts)
		);
	};

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
	}
}
