var Zotero = Components.classes["@zotero.org/Zotero;1"]
    .getService(Components.interfaces.nsISupports)
    .wrappedJSObject;

Zotero.AutoTagger = {
    config: {
        gptApiEndpoint: 'https://api.openai.com/v1/chat/completions',
        gptModel: 'gpt-4-turbo-preview',
        maxPagesToProcess: 10
    },

    async createEntryFromPDF(items) {
        if (!items.length) {
            this.showError('Please select at least one PDF item.');
            return;
        }

        let progressWindow = new Zotero.ProgressWindow();
        progressWindow.changeHeadline('Processing PDFs');
        progressWindow.show();

        try {
            for (let item of items) {
                if (item.isAttachment() && item.attachmentContentType === 'application/pdf') {
                    Zotero.debug(`Processing PDF: ${item.getField('title')}`);
                    
                    let filePath = await item.getFilePathAsync();
                    if (!filePath) {
                        Zotero.debug("Could not get file path for PDF");
                        continue;
                    }

                    // Create a new parent item
                    let newItem = new Zotero.Item('journalArticle');
                    
                    // Extract metadata using Zotero's built-in extractor
                    let translator = new Zotero.Translate.ItemGetter();
                    translator.attachmentFile = filePath;
                    let translatedItems = await translator.translate();
                    
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
            this.showError(`Error processing PDFs: ${error.message}`);
            Zotero.debug(`Error in createEntryFromPDF: ${error.stack}`);
        } finally {
            await Zotero.Promise.delay(2000);
            progressWindow.close();
        }
    },

    async autoTagItems(items) {
        if (!items.length) {
            this.showError('Please select at least one item to tag.');
            return;
        }

        let progressWindow = new Zotero.ProgressWindow();
        progressWindow.changeHeadline('Auto-tagging items');
        progressWindow.show();

        try {
            for (let item of items) {
                // Implementation for auto-tagging
                // This will be implemented based on your specific requirements
                Zotero.debug(`Auto-tagging item: ${item.getField('title')}`);
            }
        } catch (error) {
            this.showError(`Error auto-tagging items: ${error.message}`);
            Zotero.debug(`Error in autoTagItems: ${error.stack}`);
        } finally {
            await Zotero.Promise.delay(2000);
            progressWindow.close();
        }
    },

    showError(message) {
        let progressWindow = new Zotero.ProgressWindow();
        progressWindow.changeHeadline('Error');
        let progress = new progressWindow.ItemProgress(null, message);
        progress.setError();
        progressWindow.show();
        progressWindow.startCloseTimer(8000);
    }
}; 