#!/bin/bash

# Create build directory
rm -rf build
mkdir build

# Copy files to build directory
cp -r chrome defaults resource manifest.json chrome.manifest build/

# Create XPI
cd build
zip -r ../zotero-auto-tagger.xpi *
cd ..

# Clean up
rm -rf build

echo "Plugin packaged as zotero-auto-tagger.xpi" 