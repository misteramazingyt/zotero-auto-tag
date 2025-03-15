var { Services } = Components.utils.import("resource://gre/modules/Services.jsm");

// Store plugin resource URI for cleanup
var resourceURI;
var autoTagger;

function install(data, reason) {}

function uninstall(data, reason) {}

async function startup({ id, version, rootURI }, reason) {
    // Wait for Zotero to be ready
    await Zotero.initializationPromise;
    
    // Register resource URI
    resourceURI = Services.io.newURI(rootURI);
    Services.io.getProtocolHandler("resource")
        .QueryInterface(Components.interfaces.nsIResProtocolHandler)
        .setSubstitution("zotero-auto-tagger", resourceURI);

    // Load modules
    Components.utils.import("resource://zotero-auto-tagger/modules/autoTagger.js");
    
    if (!Zotero.AutoTagger) {
        Zotero.AutoTagger = {};
    }

    // Initialize menu items
    if (Zotero.ItemTreeView && Zotero.ItemTreeView.prototype) {
        let originalOnPopup = Zotero.ItemTreeView.prototype.onPopup;
        
        Zotero.ItemTreeView.prototype.onPopup = function(event) {
            let originalResult = originalOnPopup.apply(this, arguments);
            
            try {
                // Add our menu items
                let items = Zotero.getActiveZoteroPane().getSelectedItems();
                if (items.length) {
                    event.target.appendChild(document.createXULElement("menuseparator"));
                    
                    let autoTagMenuItem = document.createXULElement("menuitem");
                    autoTagMenuItem.setAttribute("label", "Auto-Tag Entry");
                    autoTagMenuItem.addEventListener("command", () => Zotero.AutoTagger.autoTagItems(items));
                    event.target.appendChild(autoTagMenuItem);
                    
                    let autoEntryMenuItem = document.createXULElement("menuitem");
                    autoEntryMenuItem.setAttribute("label", "Create Entry from PDF");
                    autoEntryMenuItem.addEventListener("command", () => Zotero.AutoTagger.createEntryFromPDF(items));
                    event.target.appendChild(autoEntryMenuItem);
                }
            } catch (e) {
                Zotero.debug("Error in Auto-Tagger menu popup: " + e);
            }
            
            return originalResult;
        };
    }
}

function shutdown(data, reason) {
    if (reason === APP_SHUTDOWN) return;
    
    if (typeof Zotero === "undefined") return;
    
    // Unregister resource URI
    if (resourceURI) {
        Services.io.getProtocolHandler("resource")
            .QueryInterface(Components.interfaces.nsIResProtocolHandler)
            .setSubstitution("zotero-auto-tagger", null);
    }
    
    // Cleanup
    if (Zotero.AutoTagger) {
        delete Zotero.AutoTagger;
    }
} 