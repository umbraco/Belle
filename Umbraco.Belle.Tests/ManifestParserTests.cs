using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using Newtonsoft.Json.Linq;
using Umbraco.Belle.Controllers;
using Umbraco.Belle.System;

namespace Umbraco.Belle.Tests
{
    [TestFixture]
    public class ServerVariablesParserTests
    {
        [Test]
        public void Parse()
        {
            var d = new Dictionary<string, object>();
            d.Add("test1", "Test 1");
            d.Add("test2", "Test 2");
            d.Add("test3", "Test 3");
            d.Add("test4", "Test 4");
            d.Add("test5", "Test 5");

            var output = ServerVariablesParser.Parse(d);

            Assert.IsTrue(output.Contains(@"Umbraco.Sys.ServerVariables = {
  ""test1"": ""Test 1"",
  ""test2"": ""Test 2"",
  ""test3"": ""Test 3"",
  ""test4"": ""Test 4"",
  ""test5"": ""Test 5""
} ;"));
        }
    }

    [TestFixture]
    public class ManifestParserTests
    {

        [Test]
        public void Merge_JArrays()
        {
            var obj1 = JArray.FromObject(new[] { "test1", "test2", "test3" });
            var obj2 = JArray.FromObject(new[] { "test1", "test2", "test3", "test4" });
            
            ManifestParser.MergeJArrays(obj1, obj2);

            Assert.AreEqual(4, obj1.Count());
        }

        [Test]
        public void Merge_JObjects_Replace_Original()
        {
            var obj1 = JObject.FromObject(new
                {
                    Property1 = "Value1",
                    Property2 = "Value2",
                    Property3 = "Value3"
                });

            var obj2 = JObject.FromObject(new
            {
                Property3 = "Value3/2",
                Property4 = "Value4",
                Property5 = "Value5"
            });

            ManifestParser.MergeJObjects(obj1, obj2);

            Assert.AreEqual(5, obj1.Properties().Count());
            Assert.AreEqual("Value3/2", obj1.Properties().ElementAt(2).Value.Value<string>());
        }

        [Test]
        public void Merge_JObjects_Keep_Original()
        {
            var obj1 = JObject.FromObject(new
            {
                Property1 = "Value1",
                Property2 = "Value2",
                Property3 = "Value3"
            });

            var obj2 = JObject.FromObject(new
            {
                Property3 = "Value3/2",
                Property4 = "Value4",
                Property5 = "Value5"
            });

            ManifestParser.MergeJObjects(obj1, obj2, true);

            Assert.AreEqual(5, obj1.Properties().Count());
            Assert.AreEqual("Value3", obj1.Properties().ElementAt(2).Value.Value<string>());
        }

        [Test]
        public void Get_Default_Config()
        {
            var config = ManifestParser.GetDefaultConfig();            
            var paths = config.Properties().SingleOrDefault(x => x.Name == "paths");
            var shim = config.Properties().SingleOrDefault(x => x.Name == "shim");
            Assert.IsNotNull(paths);
            Assert.AreEqual(typeof(JProperty), paths.GetType());
            Assert.IsNotNull(shim);
            Assert.AreEqual(typeof(JProperty), shim.GetType());
        }

        [TestCase("C:\\Test", "C:\\Test\\MyFolder\\AnotherFolder", 2)]
        [TestCase("C:\\Test", "C:\\Test\\MyFolder\\AnotherFolder\\YetAnother", 3)]
        [TestCase("C:\\Test", "C:\\Test\\", 0)]
        public void Get_Folder_Depth(string baseFolder, string currFolder, int expected)
        {
            Assert.AreEqual(expected,
                ManifestParser.FolderDepth(
                new DirectoryInfo(baseFolder), 
                new DirectoryInfo(currFolder)));
        }

        [Test]
        public void Get_Default_Init()
        {
            var init = ManifestParser.GetDefaultInitialization();
            Assert.IsTrue(init.Any());
        }

        //[Test]
        //public void Parse_Property_Editor()
        //{

        //}

        [Test]
        public void Create_Manifest_From_File_Content()
        {
            var content1 = "{}";
            var content2 = "{config: {}, init: []}";
            var content3 = "{config: {paths: {blah: 'mypath.js'}, shim: {'blah' : {'exports': 'blah'}}}, init: []}";
            var content4 = "{propertyEditors: [], config: {paths: {blah: 'mypath.js'}, shim: {'blah' : {'exports': 'blah'}}}, init: []}";

            var result = ManifestParser.CreateManifests(null, content1, content2, content3, content4);

            Assert.AreEqual(4, result.Count());
            Assert.AreEqual(0, result.ElementAt(1).JavaScriptConfig.Properties().Count());
            Assert.AreEqual(2, result.ElementAt(2).JavaScriptConfig.Properties().Count());
            Assert.AreEqual(2, result.ElementAt(3).JavaScriptConfig.Properties().Count());
        }

        [Test]
        public void Parse_Main()
        {
            var result = ManifestParser.ParseMain("{Hello}", "[World]");

            Assert.IsTrue(result.StartsWith("require.config({Hello});"));
            Assert.IsTrue(result.Contains("require([World]"));
        }

    }
}
