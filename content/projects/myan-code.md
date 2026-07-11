---
title: MyanCode
slug: myan-code
description: Burmese natural programming language. Beginner-friendly. Multi-paradigm. Fully offline.
tags: [Programming Language, Javascript]
date: "2026-06-20"
github: https://github.com/Kaung-Myat/myancode-docs
status: active
featured: true
cover: /images/projects/myan-code.png
---

# MyanCode · မြန်မာကုဒ်

> A Burmese natural language programming language for beginners.  
> Write code in Myanmar script — MyanCode understands it, transpiles it to JavaScript, and runs it.

[![npm version](https://img.shields.io/npm/v/myancode)](https://www.npmjs.com/package/myancode)
[![license](https://img.shields.io/npm/l/myancode)](LICENSE)

**Live IDE →** [https://myancode.xyz/](https://myancode.xyz/)  
**npm →** `npm install -g myancode`

---

## What is MyanCode?

MyanCode is a multi-paradigm programming language written entirely in the Burmese (Myanmar) language. It targets university students in Myanmar who are learning programming for the first time and face a double burden — learning to think computationally _and_ reading a foreign language at the same time.

With MyanCode, students write code like this:

```
score ကို ၇၅ အဖြစ်သတ်မှတ်ပါ
အကယ်၍ score က ၈၀ ထက်ကြီးရင်
  ပြောပါ "ဂုဏ်ထူး"
မဟုတ်ရင်
  ပြောပါ "ပျမ်းမျှ"
ပြီးပါပြီ
```

Which runs as:

```
ပျမ်းမျှ
```

---

## Features

- **Burmese-native syntax** — all keywords are natural Burmese words, not transliterations
- **Myanmar digit support** — write `၅` or `5`, both work identically
- **Multi-paradigm** — procedural, functional (functions as values), and object-oriented (objects with properties and methods)
- **VS Code-style browser IDE** — syntax highlighting, file explorer, tabs, output console, JS view
- **Friendly Burmese error messages** — no raw English stack traces for beginners
- **CLI compiler** — run `.myan` files directly from the terminal like `node` or `python`
- **Fully offline** — no AI, no cloud API, pure rule-based NLP engine

---

## How It Works

MyanCode uses a 6-stage NLP pipeline:

```
[Burmese source .myan]
        ↓
[1] Tokenizer       — splits text into typed tokens (lexical analysis)
        ↓
[2] Classifier      — identifies the intent of each line (text classification)
        ↓
[3] Extractor       — pulls out variable names, values, operators (NER)
        ↓
[4] AST Builder     — assembles lines into a nested syntax tree (syntactic parsing)
        ↓
[5] Transpiler      — converts the tree to JavaScript (language generation)
        ↓
[6] Runtime         — executes via Node.js child process, captures output
```

---

## Installation

Requires [Node.js v18+](https://nodejs.org).

```bash
npm install -g myancode
```

---

## Usage

### Run a `.myan` file

```bash
myancode program.myan
```

### Open the browser IDE

```bash
myancode --ide
```

Or visit [myan-code.vercel.app](https://myan-code.vercel.app) directly.

### Help

```bash
myancode --help
```

---

## Run locally from source

```bash
git clone https://github.com/Kaung-Myat/Myan-Code.git
cd myancode
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

---

## Language Reference

### Output & Input

| Keyword       | Example                | Meaning         |
| ------------- | ---------------------- | --------------- |
| `ပြောပါ`      | `ပြောပါ "မင်္ဂလာပါ"`   | Print / output  |
| `ထည့်သွင်းပါ` | `name ကို ထည့်သွင်းပါ` | Read user input |

### Variables & Values

| Keyword                  | Example                           | Meaning           |
| ------------------------ | --------------------------------- | ----------------- |
| `ကို ... အဖြစ်သတ်မှတ်ပါ` | `x ကို ၅ အဖြစ်သတ်မှတ်ပါ`          | Assign a variable |
| `မှန်သည်`                | `flag ကို မှန်သည် အဖြစ်သတ်မှတ်ပါ` | Boolean true      |
| `မှားသည်`                | `flag ကို မှားသည် အဖြစ်သတ်မှတ်ပါ` | Boolean false     |
| `ဘာမှမရှိ`               | `x ကို ဘာမှမရှိ အဖြစ်သတ်မှတ်ပါ`   | Null              |

### Conditions

| Keyword          | Example                      | Meaning         |
| ---------------- | ---------------------------- | --------------- |
| `အကယ်၍ ... ရင်`  | `အကယ်၍ x က ၅ ထက်ကြီးရင်`     | If              |
| `သို့မဟုတ်အကယ်၍` | `သို့မဟုတ်အကယ်၍ x က ၃ ညီရင်` | Else-if         |
| `မဟုတ်ရင်`       | `မဟုတ်ရင်`                   | Else            |
| `ပြီးပါပြီ`      | `ပြီးပါပြီ`                  | Close any block |

### Loops

| Keyword                | Example                | Meaning        |
| ---------------------- | ---------------------- | -------------- |
| `... သောကာလ`           | `i က ၁၀ ထက်နည်းသောကာလ` | While loop     |
| `... အကြိမ် ပြုလုပ်ပါ` | `၅ အကြိမ် ပြုလုပ်ပါ`   | Repeat N times |
| `... တစ်ခုစီအတွက်`     | `nums တစ်ခုစီအတွက် n`  | For-each       |

### Functions

| Keyword         | Example                       | Meaning           |
| --------------- | ----------------------------- | ----------------- |
| `လုပ်ဆောင်ချက်` | `လုပ်ဆောင်ချက် နှုတ်ဆက် name` | Define a function |
| `ကိုခေါ်ပါ`     | `နှုတ်ဆက် ကိုခေါ်ပါ "Kaung"`  | Call a function   |
| `ပြန်ပေးပါ`     | `ပြန်ပေးပါ result`            | Return a value    |

Functions are **first-class values** — store a function in a variable and call it through that variable:

```
လုပ်ဆောင်ချက် နှစ်ဆ x
  ပြန်ပေးပါ x မြှောက် ၂
ပြီးပါပြီ
double ကို နှစ်ဆ အဖြစ်သတ်မှတ်ပါ
result ကို double ကိုခေါ်ပါ ၅ အဖြစ်သတ်မှတ်ပါ
ပြောပါ result
```

### Arrays

| Keyword               | Example                          | Meaning          |
| --------------------- | -------------------------------- | ---------------- |
| `စာရင်း ... ဖန်တီးပါ` | `စာရင်း nums ဖန်တီးပါ [၁, ၂, ၃]` | Create a list    |
| `ထဲသို့ထည့်ပါ`        | `nums ထဲသို့ထည့်ပါ ၁၀`           | Add item to list |

### Objects (OOP)

| Keyword                         | Example                     | Meaning           |
| ------------------------------- | --------------------------- | ----------------- |
| `အရာဝတ္ထု ... ဖန်တီးပါ`         | `ကား ကို အရာဝတ္ထု ဖန်တီးပါ` | Create an object  |
| `၏`                             | `ကား၏အရောင်`                | Access a property |
| `လုပ်ဆောင်ချက်` (inside object) | `လုပ်ဆောင်ချက် မောင်း`      | Define a method   |
| `ကိုခေါ်ပါ` (on object)         | `ကား၏မောင်း ကိုခေါ်ပါ`      | Call a method     |

```
ကား ကို အရာဝတ္ထု ဖန်တီးပါ
  အရောင် ကို "အနီ" အဖြစ်သတ်မှတ်ပါ
  လုပ်ဆောင်ချက် မောင်း
    ပြောပါ "ကားမောင်းနေသည်"
  ပြီးပါပြီ
ပြီးပါပြီ
ပြောပါ ကား၏အရောင်
ကား၏မောင်း ကိုခေါ်ပါ
```

### Comments

```
မှတ်ချက် ဒါက comment တစ်ကြောင်းပါ — run ဆိုရင် ကျော်သွားသည်
```

### Operators

| Burmese            | JS     | Meaning          |
| ------------------ | ------ | ---------------- |
| `ပေါင်း`           | `+`    | Add              |
| `နုတ်`             | `-`    | Subtract         |
| `မြှောက်`          | `*`    | Multiply         |
| `စား`              | `/`    | Divide           |
| `အကြွင်း`          | `%`    | Modulo           |
| `ထက်ကြီးရင်`       | `>`    | Greater than     |
| `ထက်နည်းရင်`       | `<`    | Less than        |
| `ထက်ကြီးသို့ညီရင်` | `>=`   | Greater or equal |
| `ထက်နည်းသို့ညီရင်` | `<=`   | Less or equal    |
| `ညီရင်`            | `===`  | Equal            |
| `မညီရင်`           | `!==`  | Not equal        |
| `နှင့်`            | `&&`   | Logical AND      |
| `သို့မဟုတ်`        | `\|\|` | Logical OR       |
| `၏`                | `.`    | Property access  |

### Myanmar Digits

Both digit systems work interchangeably:

| Myanmar | ၀   | ၁   | ၂   | ၃   | ၄   | ၅   | ၆   | ၇   | ၈   | ၉   |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| English | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   |

---

## Complete Example

```
မှတ်ချက် ---- Procedural ----
score ကို ၇၅ အဖြစ်သတ်မှတ်ပါ
အကယ်၍ score က ၉၀ ထက်ကြီးရင်
  ပြောပါ "A grade"
သို့မဟုတ်အကယ်၍ score က ၇၀ ထက်ကြီးရင်
  ပြောပါ "B grade"
မဟုတ်ရင်
  ပြောပါ "C grade"
ပြီးပါပြီ

မှတ်ချက် ---- Functional ----
လုပ်ဆောင်ချက် နှစ်ဆ x
  ပြန်ပေးပါ x မြှောက် ၂
ပြီးပါပြီ
double ကို နှစ်ဆ အဖြစ်သတ်မှတ်ပါ
ပြောပါ double ကိုခေါ်ပါ ၆

မှတ်ချက် ---- Object-oriented ----
ကား ကို အရာဝတ္ထု ဖန်တီးပါ
  အရောင် ကို "အနီ" အဖြစ်သတ်မှတ်ပါ
  လုပ်ဆောင်ချက် မောင်း
    ပြောပါ "ကားမောင်းနေသည်"
  ပြီးပါပြီ
ပြီးပါပြီ
ပြောပါ ကား၏အရောင်
ကား၏မောင်း ကိုခေါ်ပါ

မှတ်ချက် ---- Arrays & loops ----
စာရင်း scores ဖန်တီးပါ [၈၅, ၄၅, ၉၂]
scores တစ်ခုစီအတွက် s
  အကယ်၍ s က ၅၀ ထက်ကြီးရင်
    ပြောပါ "အောင်"
  မဟုတ်ရင်
    ပြောပါ "ကျ"
  ပြီးပါပြီ
ပြီးပါပြီ
```

---

## Project Structure

```
myancode/
├── bin/
│   └── myancode.js          CLI entry point
├── src/
│   ├── engine/
│   │   ├── tokenizer.js     Stage 1 — lexical analysis
│   │   ├── classifier.js    Stage 2 — intent classification
│   │   ├── extractor.js     Stage 3 — entity extraction (NER)
│   │   ├── ast.js           Stage 4 — AST builder
│   │   ├── transpiler.js    Stage 5 — JS code generation
│   │   ├── runner.js        Stage 6 — Node.js execution
│   │   └── errors.js        Burmese error translation
│   └── ide/
│       ├── server.js        Express server (local dev + Vercel)
│       └── public/
│           └── index.html   VS Code-style browser IDE
├── config/
│   ├── keywords.json        Burmese keyword definitions
│   └── errors.json          Burmese error message templates
├── examples/                Sample .myan programs
└── tests/                   Unit tests for each engine module
```

---

## Stats

| Item             | Value                          |
| ---------------- | ------------------------------ |
| Keywords         | 28                             |
| Operators        | 14                             |
| Paradigms        | 3 (procedural, functional, OO) |
| NLP stages       | 6                              |
| File extension   | `.myan`                        |
| Transpile target | JavaScript (Node.js)           |
| Error language   | Burmese only                   |
| Cloud dependency | None — fully offline           |
