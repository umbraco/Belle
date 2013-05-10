//create the namespace (NOTE: This loads before any dependencies so we don't have a namespace mgr so we just create it manually)
var Umbraco = {};
Umbraco.Sys = {};
//define a global static object
Umbraco.Sys.ServerVariables = ##Variables## ;