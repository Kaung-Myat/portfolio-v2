---
title: g_tester
slug: g-tester
description: g_tester is a command-line tool that automatically generates Dart/Flutter unit test files from your project's lib/ structure. It supports both basic test skeletons and AI-powered test generation
tags: [Dart, AI, Open Source, pub.dev]
date: "2025-12-17"
pubdev: https://pub.dev/packages/g_tester
github: https://github.com/Kaung-Myat/g_tester
status: active
featured: true
cover: /images/projects/g-tester.png
---

g_tester is a command-line tool that automatically generates Dart/Flutter unit test files from your project's lib/ structure. It supports both basic test skeletons and AI-powered test generation using Gemini for business logic, services, and utility classes.

## Features

- **Automatic Unit Test Generation**: Analyzes your Dart classes and generates comprehensive unit test files
- **Class Analysis**: Identifies class constructors, methods, async operations, and exception handling
- **Method Testing**: Automatically generates tests for various method types and callbacks
- **AI-Powered Generation**: Optional AI enhancement using Google's Gemini for more comprehensive tests
- **Cross-Platform**: Works on Linux, Windows, and macOS
- **Multiple Directory Support**: Automatically processes classes in `/domain/`, `/data/`, `/core/`, `/utils/`, and `/presentation/` directories

## Installation

```bash
dart pub global activate g_tester
```

## Usage

### Generate Basic Unit Test Skeletons

```bash
g_tester --unit
# or shorter:
g_tester -u
```

### Generate AI-Enhanced Tests

```bash
# Use default model
g_tester --ai "YOUR_GEMINI_API_KEY"

# Use specific model
g_tester --ai "gemini-2.5-pro:YOUR_GEMINI_API_KEY"
```

### Check Available Models

```bash
g_tester --check "YOUR_GEMINI_API_KEY"
```

### Check Version

```bash
g_tester --version
# or shorter:
g_tester -v
```

### Get Help

```bash
g_tester --help
# or shorter:
g_tester -h
```

## How It Works

g_tester scans your `lib/` directory (specifically files in `/domain/`, `/data/`, `/core/`, `/utils/`, and `/presentation/` subdirectories) and:

1. **Analyzes** your classes to identify:
   - Class constructors and parameters
   - Method signatures and return types
   - Async methods (Future-returning)
   - Stream methods
   - Exception handling patterns

2. **Generates** unit test files in the `test/` directory that include:
   - Basic instantiation tests
   - Method calling tests
   - Async operation tests
   - Exception handling tests
   - Proper import statements using the `test` package

## Example

Given a service class like:

```dart
class UserService {
  final String baseUrl;

  UserService(this.baseUrl);

  Future<User> getUser(int id) async {
    // Fetch user from API
  }

  void validateUser(User user) {
    if (user.name.isEmpty) {
      throw ArgumentError('User name cannot be empty');
    }
  }
}
```

g_tester generates:

```dart
import 'package:test/test.dart';
import 'package:your_app/data/user_service.dart';

void main() {
  group('UserService', () {
    test('can be instantiated', () {
      final userservice = UserService('https://api.example.com');
      expect(userservice, isNotNull);
    });

    test('handles baseUrl parameter', () {
      // TODO: Test with baseUrl parameter of type String
      // final instance = UserService(baseUrl: 'https://api.example.com');
      // expect(instance.baseUrl, 'https://api.example.com');
    });

    test('handles async operations', () async {
      final userservice = UserService('https://api.example.com');
      // TODO: Test async method functionality
      // await userservice.getUser(123);
      // expect(...);
    });

    test('handles exceptions properly', () {
      final userservice = UserService('https://api.example.com');
      // TODO: Test exception handling
      // expect(() => userservice.validateUser(InvalidUser()), throwsException);
    });
  });
}
```
