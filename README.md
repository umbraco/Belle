#Belle

Umbraco 7 UI prototype, codename "Belle" Built on AngularJS, RequireJS and Twitter Bootstrap

##Introduction
Slides from the initial demonstration of Belle done at the Umbraco DK Fest can be found here: 

http://rawgithub.com/umbraco/Belle/master/Presentation/index.html
	

##How to run
Setup a webserver and point it at the Umbraco.Belle.Client/build directory. then browse to whatever url your webserver has setup for your site.

To run on *windows*, setup IIS or IIS express to serve the Umbraco.Belle.Client/build folder. If you have web matrix installed, you can right-click the folder and open it in web matrix to run it its built-in webserver.

To run on *OS X*, open Terminal in the Umbraco.Belle.Client/build folder and run:
	
	python -m SimpleHTTPServer 8080

This will have the site on http://localhost:8080/belle

There is no authentication on the application.

##Limitations
The current prototype simply uses in-memory storage, so no database dependencies. It is aimed at showing UI, not a complete functional client-server setup. 

##Project Structure

All project files are located in /umbraco.belle.client/src which only contains client-side files, everything 
related to asp.net are in umbraco.bell

after building Belle files are located in /belle, with all files following AngularJs 
conventions:

###Folders
- */belle/lib:* Dependencies
- */belle/js:* Application javascript files
- */belle/views/common/:* Main application views
- */belle/views/application/editors:* Editors html
- */belle/views/application/propertyeditors:* Property Editors html


###Files
- */belle/js/app.js:* Main umbraco application / modules
- */belle/js/main.js:* require.js configuration for dependencies
- */belle/js/routes.js:* Application routes
- */belle/js/umbraco.controllers.js:* Application controllers
- */belle/js/umbraco.services.js:* Application services
- */belle/js/umbraco.resources.js:* Application resources, like content, media, users, members etc


##Getting started
The current app is built, following conventions from angularJs and bootstrap. To get started with the applicaton you will need to atleast know the basics of these frameworks 

##AngularJS
- Excellent introduction videos on http://www.egghead.io/
- Official guide at: http://docs.angularjs.org/guide/

##Require.js
- Introduction: http://javascriptplayground.com/blog/2012/07/requirejs-amd-tutorial-introduction
- Require.js website: http://requirejs.org/




