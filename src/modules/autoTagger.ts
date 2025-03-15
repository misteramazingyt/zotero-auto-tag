import { ProgressWindow } from "zotero-plugin-toolkit/dist/helpers/progressWindow";
import { config } from "../data/config";

class AutoTagger {
  private config = {
    gptApiEndpoint: 'https://api.openai.com/v1/chat/completions',
    gptModel: 'gpt-4-turbo-preview',
    maxPagesToProcess: 10
  };

  async createEntryFromPDF(items: Zotero.Item[]): Promise<void> {
    if (!items.length) {
      this.showError('Please select at least one PDF item.');
      return;
    }

    const progressWindow = new ProgressWindow("Processing PDFs");
    progressWindow.show();

    try {
      for (const item of items) {
        if (item.isAttachment() && item.attachmentContentType === 'application/pdf') {
          Zotero.debug(`Processing PDF: ${item.getField('title')}`);
          
          const filePath = await item.getFilePathAsync();
          if (!filePath) {
            Zotero.debug("Could not get file path for PDF");
            continue;
          }

          // Create a new parent item
          const newItem = new Zotero.Item('journalArticle');
          
          // Extract metadata using Zotero's built-in extractor
          const translator = new Zotero.Translate.ItemGetter();
          translator.attachmentFile = filePath;
          const translatedItems = await translator.translate();
          
          if (translatedItems?.length > 0) {
            Object.keys(translatedItems[0]).forEach(key => {
              if (key !== 'itemType') {
                newItem.setField(key, translatedItems[0][key]);
              }
            });
            
            await newItem.saveTx();
            item.parentID = newItem.id;
            await item.saveTx();
            
            Zotero.debug("Successfully created entry from PDF");
          } else {
            Zotero.debug("No metadata extracted from PDF");
          }
        }
      }
    } catch (error) {
      this.showError(`Error processing PDFs: ${error instanceof Error ? error.message : String(error)}`);
      Zotero.debug(`Error in createEntryFromPDF: ${error instanceof Error ? error.stack : String(error)}`);
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

    const progressWindow = new ProgressWindow("Auto-tagging items");
    progressWindow.show();

    try {
      for (const item of items) {
        // Implementation for auto-tagging
        // This will be implemented based on your specific requirements
        Zotero.debug(`Auto-tagging item: ${item.getField('title')}`);
      }
    } catch (error) {
      this.showError(`Error auto-tagging items: ${error instanceof Error ? error.message : String(error)}`);
      Zotero.debug(`Error in autoTagItems: ${error instanceof Error ? error.stack : String(error)}`);
    } finally {
      await Zotero.Promise.delay(2000);
      progressWindow.close();
    }
  }

  private showError(message: string): void {
    const progressWindow = new ProgressWindow("Error");
    const progress = progressWindow.createLine({
      text: message,
      type: "error"
    });
    progressWindow.show();
    progressWindow.startCloseTimer(8000);
  }
}

export default new AutoTagger(); 