# vizbee-react-native-sender-demo-app

This README provides instructions on how to set up and run the vizbee-react-native-sender-demo-app.

## Getting Started

Follow these steps to get the app running on your local machine.

### 1. Clone the Repository

Clone the repository using one of the following commands:

```bash
# Using SSH
git clone git@github.com:ClaspTV/vizbee-react-native-sender-demo-app.git

# OR using HTTPS
git clone https://github.com/ClaspTV/vizbee-react-native-sender-demo-app.git
```

### 2. Install Dependencies

After cloning the repository, navigate to the project directory and install the necessary dependencies:

```bash
cd vizbee-react-native-sample-app

# using npm
npm install

# OR using Yarn
yarn install

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

Then, if you want to run the app on a real iOS device, you need to set up your development team:

1. Open the Xcode project:

   ```bash
   open ios/ReactNativeApp.xcworkspace
   ```

2. In Xcode, select the project in the Project Navigator.
3. Select the target under the "Targets" section.
4. Go to the "Signing & Capabilities" tab.
5. In the "Team" dropdown, select your Apple Developer team.

Make sure that the bundle identifier used in your project has the proper entitlements registered in your Apple Developer account.

Finally, run the following command to start the _iOS_ app:

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

That's it! You should now have the `vizbee-react-native-sender-demo-app` running on your local machine or device.

Note: If you encounter any issues related to code signing or provisioning when running on a real device, you may need to adjust your project's code signing settings in Xcode or register your device in your Apple Developer account.
