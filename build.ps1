# Clean up any existing build artifacts
Remove-Item -Path build -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path zotero-auto-tagger.zip -ErrorAction SilentlyContinue
Remove-Item -Path zotero-auto-tagger.xpi -ErrorAction SilentlyContinue

Write-Host "Creating build directory..."
New-Item -Path build -ItemType Directory | Out-Null

Write-Host "Copying files to build directory..."

# Create necessary directories
@(
    "build/modules"
) | ForEach-Object {
    New-Item -Path $_ -ItemType Directory -Force | Out-Null
}

# Copy modules
Copy-Item -Path "modules/*" -Destination "build/modules" -Recurse -ErrorAction SilentlyContinue

# Copy root files
@(
    "manifest.json",
    "bootstrap.js"
) | ForEach-Object {
    if (Test-Path $_) {
        Copy-Item -Path $_ -Destination "build/" -Force
    }
}

Write-Host "Creating XPI file..."

# Create XPI
try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
    
    # Create zip file
    [System.IO.Compression.ZipFile]::CreateFromDirectory(
        (Join-Path (Get-Location) "build"),
        (Join-Path (Get-Location) "zotero-auto-tagger.zip"),
        $compressionLevel,
        $false
    )
    
    # Rename to XPI
    Rename-Item -Path zotero-auto-tagger.zip -NewName zotero-auto-tagger.xpi -Force
    
    Write-Host "Plugin packaged successfully as zotero-auto-tagger.xpi"
} catch {
    Write-Host "Error creating XPI file: $_"
    exit 1
}

# Clean up
Remove-Item -Path build -Recurse -Force

# Verify XPI was created
if (Test-Path zotero-auto-tagger.xpi) {
    Write-Host "XPI file created successfully at: $((Get-Item zotero-auto-tagger.xpi).FullName)"
} else {
    Write-Host "Error: XPI file was not created"
    exit 1
} 