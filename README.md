# strgzr-app

React Native-based mobile application that uses GitHub's APIs to retrieve an user's list of repositories and relatives "Stargazers" (users that starred a repository) 

---
## Summary 📖

- [Getting started 🚀](#getting-started-🚀)
    * [Prerequisites](#prerequisites)
        + [Node JS](#nodejs)
        + [React Native](#react-native)
        + [GitHub Token](#github-token)
    * [Build the app](#build-the-app)
    * [Run the app](#run-the-app)
        + [Android Emulator](#android-emulator)
        + [iOS Simulator](#ios-simulator)
        + [Physical devices](#physical-devices)
- [Architecture 🗼](#architecture-🗼)
    * [Main technologies used](#main-technologies-used)

---

# Getting started 🚀

How to run the application:

## Prerequisites

### NodeJS
To run the project is needed NodeJS.
Download it from the official site [nodejs](https://nodejs.org/en/download) or use 

### React Native
Follow the [official tutorial](https://reactnative.dev/docs/environment-setup?guide=native) for installing the `React Native CLI` for your operating system.

If you have a macOS system, you can follow both the tutorial for iOS and for Android. If you have a Linux or Windows system, you need only to install the development environment for Android.

### GitHub Token
GitHub has a rate limit to its APIs for unauthenticated users, so if you want to test intensively this app you will need to set the `GIT_HUB_TOKEN` env variabile in the `.env` file.
To generate the token you can follow the [official guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token).

## Build the app
In order to build the app, we use [npm](https://www.npmjs.com/) for managing javascript dependencies, and as stated [previously](#nodeJS)
```bash
# Clone the repository
$ git clone https://github.com/varia-zioni/strgzr-app

# CD into the repository
$ cd strgzr-app

# Install dependencies 
# Run this only during the first setup and when JS dependencies change
$ npm install
```

## Run the app
### Android Emulator
An Android Emulator must be [created and launched manually](https://developer.android.com/studio/run/managing-avds).
Then, from your command line, run these commands:
```bash
# Run Android build
$ npm run android
```
### iOS Simulator
```bash
# Run iOS build
$ npm run ios
```
### Physical devices
The React Native documentation provides a [useful guide](https://reactnative.dev/docs/running-on-device) for running projects on physical devices.

---

# Architecture 🗼
## Main technologies used

* [TypeScript](https://www.typescriptlang.org/)
* [React Native](https://facebook.github.io/react-native)
* [GitHub API](https://docs.github.com/en/rest)