
$(function(){
    var editors = $('[data-editor]');
    var p = parent.$(parent.document);


    editors.addClass("editor");

    editors.on("click", function (event) {
        event.preventDefault();

      //  parent.document.fire("umbraco.grid.click");

        var e = jQuery.Event("umbraco.grid.click", {someVal: 76, something: "HULK"});
        p.trigger( e );

       
    });
});



