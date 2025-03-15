import { ZoteroToolkit, unregister } from "zotero-plugin-toolkit";
import { config } from "./data/config";
import { getString } from "./modules/locale";
import autoTagger from "./modules/autoTagger";

class AutoTaggerPlugin {
  private data = {
    alive: true,
    toolkit: new ZoteroToolkit()
  };

  // This is called when the plugin is loaded
  public async onStartup() {
    await this.initializePreferences();
    this.registerMenuItems();
  }

  // This is called when the plugin is unloaded
  public async onShutdown() {
    this.data.alive = false;
    // Clean up any resources
    await unregister();
  }

  private async initializePreferences() {
    // Initialize any preferences here
  }

  private registerMenuItems() {
    if (Zotero.ItemTreeView && Zotero.ItemTreeView.prototype) {
      const originalOnPopup = Zotero.ItemTreeView.prototype.onPopup;
      
      Zotero.ItemTreeView.prototype.onPopup = function(event) {
        const originalResult = originalOnPopup.apply(this, arguments);
        
        try {
          // Add our menu items
          const items = Zotero.getActiveZoteroPane().getSelectedItems();
          if (items.length) {
            event.target.appendChild(document.createXULElement("menuseparator"));
            
            const autoTagMenuItem = document.createXULElement("menuitem");
            autoTagMenuItem.setAttribute("label", getString("menuitem-autotag-label"));
            autoTagMenuItem.addEventListener("command", () => autoTagger.autoTagItems(items));
            event.target.appendChild(autoTagMenuItem);
            
            const createEntryMenuItem = document.createXULElement("menuitem");
            createEntryMenuItem.setAttribute("label", getString("menuitem-createentry-label"));
            createEntryMenuItem.addEventListener("command", () => autoTagger.createEntryFromPDF(items));
            event.target.appendChild(createEntryMenuItem);
          }
        } catch (e) {
          this.data.toolkit.log("Error in Auto-Tagger menu popup: " + e);
        }
        
        return originalResult;
      };
    }
  }
}

export default new AutoTaggerPlugin(); 