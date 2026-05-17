---
title: excel_to_arb
slug: excel-to-arb
description: A command-line tool that simplifies localization management by converting Excel spreadsheets (.xlsx) into Flutter's ARB (Application Resource Bundle) format.y hostels in real-time using GPS and interactive maps.
tags: [Dart, Open Source, pub.dev]
date: "2025-06-17"
pubdev: https://pub.dev/packages/g_tester
github: https://github.com/Kaung-Myat/excel_to_arb
status: active
featured: true
cover: /images/projects/excel-to-arb.png
---

## Features

- **Effortless Conversion:** Quickly transforms `.xlsx` files into `.arb` files.
- **Placeholder Support:** Automatically handles dynamic values (e.g., `{name}`) with type definitions for robust localization.
- **Description Inclusion:** Supports adding descriptive context for each translation key.
- **Command-Line Interface:** Easy to integrate into your build or CI/CD workflows using familiar flags.

---

## Installation

You can activate this tool globally on your system, making it accessible from any directory.

```bash
dart pub global activate excel_to_arb
```

---

## Usage

### Excel File Preparation

- Name must follow pattern: **app\_\*.xlsx** (e.g., `app_my.xlsx`)
- Structure your spreadsheet with these columns:

| Key     | Value        | Description (optional) | Placeholder (name:type) |
| ------- | ------------ | ---------------------- | ----------------------- |
| hello   | မင်္ဂလာပါ    | Greeting text          | name:String , age: int  |
| goodbye | နုတ်ဆက်ပါတယ် | Farewell text          | name:String , age: int  |

---

Example Files: You can find sample Excel files demonstrating this structure in the **resources/l10n** directory of this repository:

[https://github.com/Kaung-Myat/excel_to_arb/tree/main/resources/l10n](https://github.com/Kaung-Myat/excel_to_arb/tree/main/resources/l10n)

### Running the Converter

Once your Excel files are prepared, run the tool from your terminal.

```bash
excel_to_arb --source <path/to/source/excel/dir> --target <path/to/target/arb/dir>
```

### Arguments:

- `-s` , `--source` : (Required) The path to the directory containing your `app_*.xlsx` files.

- `-t`,`--target` : (Required) The path to the directory where the generated `app_*.arb` files will be saved. The tool will create this directory if it doesn't exist.

- `-h`,`--help` : Displays usage information and available options.

### Example

```bash
excel_to_arb --source /path/to/your_project/resources/l10n --target /path/to/your_project/config/l10n
```
