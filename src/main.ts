import { App, Modal, Plugin, PluginSettingTab, Setting } from "obsidian";
import { parser as ptaLangParser } from "src/parser/ptaLangParser";
import { parser } from "src/parser/ptaParser";
import { createTransactionForm } from "./ui/TransactionForm";

interface PtaPluginSettings {
	ledgerPath: string;
}

const DEFAULT_SETTINGS: PtaPluginSettings = {
	ledgerPath: "Ledger.md",
};

export default class PtaPlugin extends Plugin {
	settings: PtaPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
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

				const ledger: any = vault.getAbstractFileByPath(
					this.settings.ledgerPath
				);

				const ledgerContent = await vault.cachedRead(ledger);
				const controller = parser(ledgerContent);

				query.setController(controller);
				query.execute(el);
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
		let output = `${date} "${description}"\n`;

		for (const { account, amount } of accounts) {
			if (account) {
				output += ` ${account}`;

				if (amount) {
					output += ` ${amount}INR`;
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
		const ledger: any = this.app.vault.getAbstractFileByPath(
			this.plugin.settings.ledgerPath
		);

		this.app.vault.append(
			ledger,
			this.formatTransaction(date, description, accounts)
		);
	};

	onOpen() {
		const { contentEl } = this;
		createTransactionForm(contentEl, this.handleFormSubmit, this.app);
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
	}
}
