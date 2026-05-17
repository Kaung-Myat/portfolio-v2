---
title: LOOI
slug: looi
description: This is a recreation of the Looi AI assistant, built entirely in Flutter. It's a fun project that features voice interaction, AI text responses, and some cool facial animations.
tags: [Flutter, Dart, AI, Open Source]
date: "2025-12-17"
github: https://github.com/Kaung-Myat/LOOI_ROBOT_Flutter
status: active
featured: true
cover: /images/projects/looi.jpg
---

This is a recreation of the Looi AI assistant, built entirely in Flutter. It's a fun project that features voice interaction, AI text responses, and some cool facial animations.

## Key Packages Used

Here are the main libraries making this thing tick:

- **provider:** Handles state management across the app.
- **get_it:** Keeps the code clean by handling dependency injection (Service Locator).
- **flutter_secure_storage:** Safely stores sensitive info, like your API keys.
- **http:** Connects to the Groq API to handle the logic.
- **speech_to_text:** Converts your voice input into text.
- **flutter_tts:** Gives the AI a voice to read responses back to you.

## What You Can Learn From This Code

If you dive into the source code, you'll find practical examples of:

- **State Management:** How to use `provider` to manage data flow effectively.
- **Dependency Injection:** How to set up `get_it` so you can access your services anywhere in the app without messy imports.
- **Secure Storage:** Best practices for saving user secrets locally.
- **API Integration:** How to structure HTTP requests to third-party AI services (like Groq).
- **Voice Features:** Implementing a full conversation loop (Listening $\rightarrow$ Processing $\rightarrow$ Speaking).
- **Custom Animations:** How to create fluid, organic-looking animations using just `CustomPaint` and `Timer`—no heavy image assets required.
- **AI App Structure:** A solid blueprint for building your own conversational AI apps.
