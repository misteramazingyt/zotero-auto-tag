const esbuild = require("esbuild");
const compressing = require("compressing");
const path = require("path");
const fs = require("fs");
const replace = require("replace-in-file");
const process = require("process");

// Get the version from package.json
const pkg = require("./package.json");

async function build() {
  const isDev = process.argv.includes("--dev");
  const watch = process.argv.includes("--watch");

  // Build settings
  const buildSettings = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "build/addon/content/scripts/index.js",
    platform: "neutral",
    target: ["firefox102"],
    minify: !isDev,
    sourcemap: isDev ? "inline" : false,
    external: [
      "resource://*", 
      "chrome://*",
      "zotero-plugin-toolkit",
      "zotero-plugin-toolkit/*"
    ],
    format: "iife",
    loader: {
      ".ftl": "text",
    },
    define: {
      "process.env.NODE_ENV": isDev ? '"development"' : '"production"'
    },
    alias: {
      "zotero-plugin-toolkit": path.resolve(__dirname, "node_modules/zotero-plugin-toolkit/dist/index.js"),
      "zotero-plugin-toolkit/dist/helpers/locale": path.resolve(__dirname, "node_modules/zotero-plugin-toolkit/dist/helpers/locale.js"),
      "zotero-plugin-toolkit/dist/helpers/progressWindow": path.resolve(__dirname, "node_modules/zotero-plugin-toolkit/dist/helpers/progressWindow.js")
    }
  };

  try {
    // Ensure build directory exists
    if (!fs.existsSync("build")) {
      fs.mkdirSync("build");
    }
    if (!fs.existsSync("build/addon")) {
      fs.mkdirSync("build/addon");
    }
    if (!fs.existsSync("build/addon/content")) {
      fs.mkdirSync("build/addon/content");
    }
    if (!fs.existsSync("build/addon/content/scripts")) {
      fs.mkdirSync("build/addon/content/scripts");
    }

    // Copy addon files
    fs.cpSync("addon", "build/addon", { recursive: true });

    // Build
    if (watch) {
      const context = await esbuild.context(buildSettings);
      await context.watch();
      console.log("Watching...");
    } else {
      await esbuild.build(buildSettings);
      console.log("Build complete");

      // If not in dev mode, create XPI
      if (!isDev) {
        const xpiName = `zotero-auto-tagger-${pkg.version}.xpi`;
        await compressing.zip.compressDir("build/addon", `build/${xpiName}`);
        console.log(`Created ${xpiName}`);
      }
    }
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
}

build(); 