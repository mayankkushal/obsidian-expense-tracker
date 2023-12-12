import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";
import { parser as ptaLangParser } from "src/parser/ptaLangParser";
import { parser } from "src/parser/ptaParser";
import { BalanceView } from "./ui/BalanceView";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

const ptaCode = `
2023-08-10 "Starting Balance"
 Assets:Banking:HDFC 1000.00INR
 Assets:Banking:Axis 2000.00INR

2023-08-10 "Lunch"
 Expenses:Food:Lunch 110.00INR
 Assets:Banking:HDFC

2023-08-10 "Dinner"
 Expenses:Food:Dinner 150.00INR
 Assets:Banking:HDFC

2023-08-11 "C"
 Expenses:Cigg 150INR
 Assets:Banking:HDFC
`;

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			async (evt: MouseEvent) => {
				const { vault } = this.app;

				const ledger = vault.getAbstractFileByPath("Ledger.md");

				if (ledger instanceof TFile) {
					const ledgerContent = await vault.read(ledger);
					const controller = parser(ledgerContent);
				}
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor(
			"pta",
			async (source, el, ctx) => {
				const query = ptaLangParser(source.trim());
				const { vault } = this.app;

				const ledger: any = vault.getAbstractFileByPath("Ledger.md");

				const ledgerContent = await vault.cachedRead(ledger);
				const controller = parser(ledgerContent);

				query.setController(controller);
				const response = query.execute();
				BalanceView(el, response);
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
