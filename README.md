# Zotero Auto-Tagger Plugin

A powerful Zotero plugin that automatically creates entries from PDFs and generates hierarchical tags using GPT and external metadata sources.

## Features

- **PDF to Entry**: Automatically create Zotero entries from PDF files
- **Smart Tagging**: Generate hierarchical tags using GPT and Crossref
- **Customizable**: Configure tag hierarchy levels and tagging behavior
- **Keyboard Shortcuts**: Quick access to main features
- **Progress Feedback**: Visual feedback for all operations

## Installation

1. Download the latest `zotero-auto-tagger.xpi` from the [releases page](https://github.com/yourusername/zotero-auto-tagger/releases)
2. In Zotero, go to Tools → Add-ons
3. Click the gear icon and choose "Install Add-on From File..."
4. Select the downloaded .xpi file
5. Restart Zotero

## Configuration

1. Go to Tools → Auto-Tagger Settings
2. Enter your OpenAI API key
3. Configure other settings as needed:
   - Maximum pages to process from PDFs
   - Maximum tags per hierarchy level
   - Tag hierarchy levels
   - Enable/disable Crossref integration

## Usage

### Creating Entries from PDFs

1. Select one or more PDF files in your Zotero library
2. Right-click and select "Create Entry from PDF"
   - Or use the keyboard shortcut: Ctrl+Shift+E (Cmd+Shift+E on Mac)

### Auto-tagging Items

1. Select one or more items in your Zotero library
2. Right-click and select "Auto-tag Item"
   - Or use the keyboard shortcut: Ctrl+Shift+T (Cmd+Shift+T on Mac)

### Tag Hierarchy

Tags are organized in a hierarchical structure:
- Domain (e.g., "Computer Science")
- Subdomain (e.g., "Artificial Intelligence")
- Topic (e.g., "Natural Language Processing")
- Subtopic (e.g., "Text Classification")

## Requirements

- Zotero 6.0 or later
- OpenAI API key for GPT integration
- Internet connection for external API access

## Building from Source

### Windows
```powershell
.\build.ps1
```

### Linux/Mac
```bash
chmod +x build.sh
./build.sh
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the [AGPL-3.0 License](LICENSE).

## Support

- [Report an issue](https://github.com/yourusername/zotero-auto-tagger/issues)
- [Request a feature](https://github.com/yourusername/zotero-auto-tagger/issues/new)

## Acknowledgments

- [Zotero](https://www.zotero.org/) for the amazing reference management system
- [OpenAI](https://openai.com/) for the GPT API
- [Crossref](https://www.crossref.org/) for their metadata API 