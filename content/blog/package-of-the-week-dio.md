---
title: Package Of The Week - Dio
slug: package-of-the-week-dio
description: Package Of The Week - Dio ဆိုတာ
date: "2026-06-20"
tags: [package, Dio]
cover: /images/blog/package-of-the-week-dio.jpg
---

Flutter App တစ်ခုရေးတဲ့အခါ REST API တွေနဲ့ ချိတ်ဆက်ဖို့ မဖြစ်မနေလိုအပ်လာပါတယ်။

http package နဲ့လည်း API ခေါ်လို့ရပေမယ့် Project ကြီးလာတာနဲ့အမျှ Logging, Authentication, Timeout, File Upload, Error Handling စတဲ့ Feature တွေကို စီမံရတာ ပိုရှုပ်လာတတ်ပါတယ်။

အဲ့ဒီနေရာမှာ ကျွန်တော် အမြဲသုံးဖြစ်တဲ့ Package တစ်ခုကတော့ Dio ပါ။
**pub.dev:** [https://pub.dev/packages/dio](https://pub.dev/packages/dio)

## Dio ကို သဘောကျမိတဲ့ အချက်တချို့ကတော့

### Interceptor Support

Request မပို့ခင်နဲ့ Response ပြန်လာပြီးနောက် Logic တွေ ထည့်ရေးနိုင်တာကြောင့် JWT Token ထည့်တာ၊ Request/Response Logging လုပ်တာ၊ Error Handling လုပ်တာတွေ အရမ်းအဆင်ပြေပါတယ်။

### Easy Configuration

Base URL, Headers, Timeout စတဲ့ Configuration တွေကို တစ်နေရာတည်းမှာ သတ်မှတ်ထားနိုင်ပါတယ်။

### File Upload & Download

Multipart Form Data, File Upload နဲ့ Download Progress Tracking တွေကို လွယ်လွယ်ကူကူ လုပ်ဆောင်နိုင်ပါတယ်။

### Powerful Error Handling

Network Error, Timeout နဲ့ Server Error တွေကို Exception တွေကနေ တစ်ဆင့် သေချာခွဲခြားကိုင်တွယ်နိုင်ပါတယ်။

### Request Cancellation

User က Screen ကထွက်သွားတဲ့အချိန်မျိုးမှာ မလိုအပ်တော့တဲ့ Request တွေကို Cancel လုပ်နိုင်တာကြောင့် Resource ကို ပိုမိုထိရောက်စွာ အသုံးပြုနိုင်ပါတယ်။

Flutter Project တွေမှာ Networking Layer ကို ပိုပြီး Flexible ဖြစ်စေချင်ရင် Dio က စမ်းသုံးကြည့်သင့်တဲ့ Package ကောင်းတစ်ခုပါ။
