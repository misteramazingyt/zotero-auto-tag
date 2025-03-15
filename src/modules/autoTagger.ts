import { ZoteroToolkit } from "zotero-plugin-toolkit";
import { config } from "../data/config";

class AutoTagger {
  private toolkit: ZoteroToolkit;
  private config = {
    gptApiEndpoint: 'https://api.openai.com/v1/chat/completions',
    gptModel: 'gpt-4-turbo-preview',
    maxPagesToProcess: 10
  };

  constructor() {
    this.toolkit = new ZoteroToolkit();
  }

  async createEntryFromPDF(items: Zotero.Item[]): Promise<void> {
    if (!items.length) {
      this.showError('Please select at least one PDF item.');
      return;
    }

    const progressWindow = this.toolkit.getProgressWindow("Processing PDFs");
    progressWindow.show();

    try {
      for (const item of items) {
        if (item.isAttachment() && item.attachmentContentType === 'application/pdf') {
          this.toolkit.log(`Processing PDF: ${item.getField('title')}`);
          
          const filePath = await item.getFilePathAsync();
          if (!filePath) {
            this.toolkit.log("Could not get file path for PDF");
            continue;
          }

          // Create a new parent item
          const newItem = new Zotero.Item('journalArticle');
          
          // Extract metadata using Zotero's built-in extractor
          const translator = new Zotero.Translate.ItemGetter();
          translator.attachmentFile = filePath;
          const translatedItems = await translator.translate();
          
          if (translatedItems?.length > 0) {
            Object.entries(translatedItems[0]).forEach(([key, value]) => {
              if (key !== 'itemType') {
                newItem.setField(key as keyof Zotero.Item.ItemField, value);
              }
            });
            
            await newItem.saveTx();
            item.parentID = newItem.id;
            await item.saveTx();
            
            this.toolkit.log("Successfully created entry from PDF");
          } else {
            this.toolkit.log("No metadata extracted from PDF");
          }
        }
      }
    } catch (error) {
      this.showError(`Error processing PDFs: ${error instanceof Error ? error.message : String(error)}`);
      this.toolkit.log(`Error in createEntryFromPDF: ${error instanceof Error ? error.stack : String(error)}`);
    } finally {
      await Zotero.Promise.delay(2000);
      progressWindow.close();
    }
  }

  async autoTagItems(items: Zotero.Item[]): Promise<void> {
    if (!items.length) {
      this.showError('Please select at least one item to tag.');
      return;
    }

    const progressWindow = this.toolkit.getProgressWindow("Auto-tagging items");
    progressWindow.show();

    try {
      for (const item of items) {
        // Implementation for auto-tagging
        // This will be implemented based on your specific requirements
        this.toolkit.log(`Auto-tagging item: ${item.getField('title')}`);
      }
    } catch (error) {
      this.showError(`Error auto-tagging items: ${error instanceof Error ? error.message : String(error)}`);
      this.toolkit.log(`Error in autoTagItems: ${error instanceof Error ? error.stack : String(error)}`);
    } finally {
      await Zotero.Promise.delay(2000);
      progressWindow.close();
    }
  }

  private showError(message: string): void {
    const progressWindow = this.toolkit.getProgressWindow("Error");
    progressWindow.createLine({
      text: message,
      type: "error"
    });
    progressWindow.show();
    progressWindow.startCloseTimer(8000);
  }
}

export default new AutoTagger(); 