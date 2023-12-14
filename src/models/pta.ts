import { TFile } from "obsidian";
import PtaPlugin from "src/main";

export class PTA {
	plugin: PtaPlugin;

	/**¯
	 * Creates a new instance of the class.
	 *
	 * @param {PtaPlugin} plugin - The plugin object.¯
	 */
	constructor(plugin: PtaPlugin) {
		this.plugin = plugin;
	}

	/**
	 * Retrieves the file from the specified ledger path.
	 *
	 * @return {Promise<TFile>} The file object.
	 */
	async getFile() {
		const { vault } = this.plugin.app;

		let file = vault.getAbstractFileByPath(this.plugin.settings.ledgerPath);
		if (file instanceof TFile) {
			return file;
		}

		return await vault.create(this.plugin.settings.ledgerPath, "");
	}

	/**
	 * Retrieves the ledger from the file system and returns the cached content.
	 *
	 * @return {Promise<string>} The cached content of the ledger, or an empty string if the ledger is not found.
	 */
	async cachedReadLedger() {
		const ledger = await this.getFile();
		if (ledger) {
			return await this.plugin.app.vault.cachedRead(ledger);
		}

		return "";
	}

	/**
	 * Appends content to the file.
	 *
	 * @param {string} content - The content to be appended.
	 * @return {Promise<void>} A promise that resolves when the content is appended.
	 */
	async appendContent(content: string) {
		const ledger = await this.getFile();
		this.plugin.app.vault.append(ledger, content);
	}
}
