// keyTest.js

(function () {

$(document).ready (function () {

    var j2h = require ('go-json2html');
    var ky = require ('go-key');

    var dpp = j2h.displayPage;
    var genId = j2h.genId;

    var id = genId ();
    dpp ({div: [
        {label: 'key down event', style: "background-color: #ffcccc;"}, 
        {pre: {
            span: 'press any shift/key combination', 
            id: id
        }, style: "margin: 0;"}
    ], style: "border: 1px solid blue;" +
        "border-radius: 4px;" +
        "display: inline-block;" +
        "padding: 4px;"});

    var Id = '#' + id;
        // jquery addressable

    function reportKey (chOb) {
        
        var seeIt = "";

        var nl = "";
        for (var k in chOb) {
            
            seeIt += nl + k + ': ' + chOb[k];
            nl = '\n';
        }

        $(Id)
        .empty ()
        .append (seeIt);

    };

    ky = new ky ('body', false, reportKey);
});

}) ();


