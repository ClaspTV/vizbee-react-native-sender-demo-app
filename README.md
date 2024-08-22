# react-native-demo-app

This README provides instructions on how to set up and run the react-native-demo-app.

## Getting Started

Follow these steps to get the app running on your local machine.

### 1. Clone the Repository

Clone the repository using one of the following commands:

```bash
# Using SSH
git clone git@github.com:ClaspTV/react-native-demo-app.git

# OR using HTTPS
git clone https://github.com/ClaspTV/react-native-demo-app.git
```

### 2. Install Dependencies

After cloning the repository, navigate to the project directory and install the necessary dependencies:

```bash
cd react-native-demo-app
npm install --legacy-peer-deps
```

### 3. Start the Metro Server

Next, you need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### 4. Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project.

#### For Android

Run the following command to start _Android_ app:

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

#### For iOS

First, install the pods:

```bash
cd ios && pod install && cd ..
```

Then, run the following command to start _iOS_ app:

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

That's it! You should now have the `react-native-demo-app` running on your local machine.
