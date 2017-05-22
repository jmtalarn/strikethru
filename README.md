# strikethru

## Install Node.js, Apache Cordova and Ionic framework

The first step will be install Node.js as Ionic provides a CLI that helps you to generate the app and provides some commands to build and generate the APK file and many other useful commands. You should choose your development platform and Node.js version (Long Time Support or latest stable version) and follow the steps provided by the [Node.js page.](https://nodejs.org/en/)

Once is installed, you proceed to install Ionic and Cordova as the Ionic Framework is built on the top of the Apache Cordova.

### Installing Apache Cordova

[Apache Cordova](http://cordova.apache.org/) is a Mobile application development framework that provides access to some of the API usually accessible throw the specific development platform for Android, iOs and Windows Phone apps throw a Javascript SDK to write apps using HTML5, CSS3 and plain Javascript. The following command will install the needed cordova executables globally, this is accessible for the whole system.

    sudo npm install -g cordova

### Installing Ionic Framework CLI

[Ionic](https://ionicframework.com/) adds a layer over the Cordova framework providing an optimized version of the Angular framework, a set of visual components that will adapt to the specified target to follow the visual development guidelines  respectively and a Command Line Interface with own commands and as a wrapping of the [Bower](https://bower.io/) and Cordova commands. The next command will do the proper with the Ionic CLI to set it available throw all the system.

    sudo npm install -g ionic

## Installing Bower to manage front-end dependencies

We add Bower support to install front-end libraries as project dependencies. Ionic provides a configuration to save them into a specific folder in order to be included in the final geneated bundle. The following command will set it available also globally.

    sudo npm install -g bower



## Generating the Ionic app

Once you have the Ionic CLI installed you can proceed to generate the application with just only one command:

    ionic start yourappname tabs --type ionic1  

The command details are:

*   **start** will generate a new app
*   **yourappname** is the name you want to give to your app
*   the third parameter is the app **template **to generate a basic HTML code: _blank_,_tabs_,... blank will provide the HTML for a blank page and tabs provide the HTML skeleton for a tabbed application. In our app, we have chosen the tabbed template as it fits to the [starting idea of the app](http://blog.jmtalarn.com/build-publish-ionic-app-i-idea/).
*   The final parameter **--type ionic1** forces the generator to use the version 1 of the framework because of the [technology chosen](http://blog.jmtalarn.com/build-publish-ionic-app-i-idea/#technology)

## Adding the mobile development platforms

The following command will add support for the project for the specified mobile platform.

    ionic platform add android

After this command you will be able to generate, build or emulate the application into the added platforms but you will need to install the needed SDK. In the case of Android you can follow the to add the SDK to your development box. A practical way to do it is installing and tune up the Android Studio and the Android SDK. [https://developer.android.com/studio/index.html](https://developer.android.com/studio/index.html)

## Adding Firebase libraries to the Ionic App project

We base our backend with [Firebase](http://blog.jmtalarn.com/build-publish-ionic-app-configuring-firebase/) and Ionic Framework adds Angular to build the application. So we will install the JS libraries needed. We use the bower command to install the dependency and use it locally:

    bower install firebase --save

To help us in the development we added also the [AngularFire](https://www.firebase.com/docs/web/libraries/angular/api.html) library to provide an easy use and access to the objects and collections of objects from the Firebase realtime database with the Angular Framework. AngularFire is the officially supported AngularJS binding for Firebase.

    bower install angularfire --save

In both cases we add the _--save_ flag to save it in dependencies definition and persist it on the project.

## Ionic commands

    ionic serve

This command opens a browser and display the result of the application in the standard view. If we need to show it as it was a handheld device we need to run the developer tools in Chrome, Firefox or the browser you use and adjust it in the options. This will open a server in a specific port and will be aware of live changes in code to automatically update the view.

    ionic serve --lab

Like the previous command but this one opens a browser with the views that will be generated for the iOS and Android versions of the app. Both at the same time and synchronized one from another.

Other interesting commands in the development are the following:

    ionic build android

This will generate the APK package with the content of the application if the Android SDK is correctly installed on the system.

    ionic emulate android

This will launch an emulator running the app.

    ionic run android

This will run the app into a device with USB debuggging enabled connected to the system as [described in the Android developer site](http://developer.android.com/tools/device.html). It will also automatically update if any change is detected in the source code of the application and is very useful for online debugging. If this doesn’t work, make sure you have USB debugging enabled on your device, as [described](http://developer.android.com/tools/device.html) on the Android developer site.
