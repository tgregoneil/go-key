(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// go-json2html/index.js

module.exports = (function () {

// PRIVATE Properties/Methods
var _ = {

    id: 0,
    primitiveTypesNotNull: {'string':1, 'undefined':1, 'number':1, 'boolean':1, 'symbol': 1},
        // since typeof null yields 'object', it's handled separately

}; // end PRIVATE properties


//---------------------
_.displayPageH = (parent, dispOb) => {
    
    if (dispOb === 0) {
        // case where no content is desired
        // to display an actual zero, make it a string:  "0"

        return;

    } // end if (dispOb === 0)
    
    var dispObType = typeof dispOb;
    var isPrimitive = _.primitiveTypesNotNull.hasOwnProperty (dispObType) || dispOb === null;

    if (isPrimitive) {

        Id = _.textMake (parent, dispOb, 'append');

    } else {
        
            // NE => Not Empty
        var isNEArray = Array.isArray (dispOb) && dispOb.length > 0;
        var isNEObject = !Array.isArray(dispOb) && dispObType == 'object' && Object.keys(dispOb).length > 0;
        
        var Id = null;
            // capital Id to indicate id with '#' prefixing it
    
        if (isNEObject) {
    
            if (dispOb.hasOwnProperty ('rm')) {

                var selector = dispOb.rm;
                $(selector)
                .remove ();

            } else if (dispOb.hasOwnProperty ('empty')) {

                var selector = dispOb.empty;
                $(selector)
                .empty ();

            } else if (dispOb.hasOwnProperty ('content')) {

                _.displayPageH (parent, dispOb.content);

            } else if (dispOb.hasOwnProperty ('attr')) {

                $(parent)
                .attr (dispOb.attr);

            } else {
                
                var attrs = {};
                var elementName = null;
                var content;
            
                var keys = Object.keys (dispOb);
                var insertLocation = 'append';
                for (var i = 0; i < keys.length; i++) {
        
                    var ky = keys [i];
        
                    var tagType = _.getTagType (ky);
        
                    var styleInHead = parent === 'head' && ky === 'style';
                        // style in head => html element
                        // style not in head => attribute of dispOb
                        
                    var tagNotStyle = tagType !== 0 && ky !== 'style';
        
                    if (tagNotStyle || styleInHead) {
        
                        elementName = ky;
                        content = dispOb [elementName];
        
                    } else {
                        
                        switch (ky) {
            
                            case 'parent':
                                    // do nothing -- Prevents 'parent' from becoming an attribute
                                break;
                            case 'prepend':
                            case 'append':
                            case 'before':
                            case 'after':
                                insertLocation = ky;
                                parent = dispOb [ky] === 1 ? parent : dispOb [ky];
                                    // if any of prepend, ... are specified, and the value is other
                                    // than a '1', override the parent value with that value
                                break;
            
                            default:
                                
                                attrs [ky] = dispOb [ky];
                                break;
            
                        } // end switch (ky)
        
                    } // end if (tagType !== 0)
        
                } // end for (var i = 0; i < keys; i++)
                
        
                if (!elementName) {
                    // error case -- set as text and display entire dispOb

                    elementName = 'text';
                    content = JSON.stringify (dispOb);

                } // end if (!elementName)
                
                if (elementName === 'text') {

                    Id = _.textMake (parent, content, insertLocation);

                } else {

                    Id = _.elementMake (elementName, parent, insertLocation, attrs);

                } // end if (elementName === 'text')
                
                
                if (Id !== null) {
                    // case for element not 'text'
                    
                    _.displayPageH (Id, content);

                } // end if (Id !== null)
                

            } // end if (dispOb.hasOwnProperty ('rm'))
            
    
        } else if (isNEArray) {
    
            for (var i = 0; i < dispOb.length; i++) {
    
                    // returned Id will be for last item in array
                    // useful to later add siblings with 'after' key
                Id = _.displayPageH (parent, dispOb [i]);
    
            } // end for (var i = 0; i < dispOb.length; i++)
    
        } else {
    
            Id = null;
                // case for dispOb as an empty object or empty array
    
        } // end if (isNEObject)

    } // end if (_.primitiveTypesNotNull.hasOwnProperty (dispObType))
    
        
    return Id;

}; // end _.displayPageH 

//---------------------
_.elementMake = (tag, parentOrSibl, insertLocation, attrs) => {
    
    var id;
    var attrKeys = Object.keys (attrs);
    var hasAttrs = attrKeys.length > 0;

    if (hasAttrs && attrs.hasOwnProperty ('id')) {

        id = attrs.id;

    } else {

        id = P.genId ();

    } // end if (hasAttrs)
    
    var Id = '#' + id;
    
    var divel = '<' + tag + ' id="' + id + '"';

    var tagtype = _.getTagType (tag);

    if (tagtype == 1) {

        divel += '>';

    } else {

        divel += '></' + tag + '>';

    } // end if (tagtype == 1)

    $(parentOrSibl)[insertLocation] (divel);
    
    if (hasAttrs) {
        
        $(Id)
        .attr (attrs);

    } // end if (hasAttrs)
    
    return Id;

}; // end _.elementMake

//---------------------
_.getTagType = (tag) => {

        // 1 => void elements, 2 => has content
    var tags = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, keygen: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1, a: 2, abbr: 2, address: 2, article: 2, aside: 2, audio: 2, b: 2, bdi: 2, bdo: 2, blockquote: 2, body: 2, button: 2, canvas: 2, caption: 2, cite: 2, code: 2, colgroup: 2, datalist: 2, dd: 2, del: 2, details: 2, dfn: 2, dialog: 2, div: 2, dl: 2, dt: 2, em: 2, fieldset: 2, figcaption: 2, figure: 2, footer: 2, form: 2, h1: 2, h2: 2, h3: 2, h4: 2, h5: 2, h6: 2, head: 2, header: 2, hgroup: 2, html: 2, i: 2, iframe: 2, ins: 2, kbd: 2, label: 2, legend: 2, li: 2, map: 2, mark: 2, menu: 2, meter: 2, nav: 2, noscript: 2, object: 2, ol: 2, optgroup: 2, option: 2, output: 2, p: 2, pre: 2, progress: 2, q: 2, rp: 2, rt: 2, ruby: 2, s: 2, samp: 2, script: 2, section: 2, select: 2, small: 2, span: 2, strong: 2, style: 2, sub: 2, summary: 2, sup: 2, svg: 2, table: 2, tbody: 2, td: 2, textarea: 2, tfoot: 2, th: 2, thead: 2, time: 2, title: 2, tr: 2, u: 2, ul: 2, 'var': 2, video: 2};

    tags.text = 1;  // special tag:  uses _.makeText ()
    
    return tags.hasOwnProperty(tag) ? tags [tag] : 0;

}; // end _.getTagType 


//---------------------
_.textMake = (parent, primitive, location) => {
    
    if (typeof primitive === 'string') {
        
        var singlequote = '&#x0027;';
        var backslash = '&#x005c;';
        var doublequote = '&#x0022;';
        var lt = '&lt;';
        
        primitive = primitive.replace (/'/g, singlequote);
        primitive = primitive.replace (/"/g, doublequote);
        primitive = primitive.replace (/\\/g, backslash);
        primitive = primitive.replace (/</g, lt);

    } else if (typeof primitive === 'symbol') {

        primitive = 'symbol';
            // otherwise stringify would produce '{}' which is less useful

    } else {

        primitive = JSON.stringify (primitive);

    } // end if (typeof primitive === 'string')
    

    $(parent) [location] (primitive);

    return null;
        // text obs have no id's: only text is appended with no way to address it
        // if addressing is necessary, use span instead of text

}; // end _.textMake 



// PUBLIC Properties/Methods
var P = {};

//---------------------
P.displayPage = (dispOb) => {
    
    var parent = dispOb.hasOwnProperty ('parent') ? dispOb.parent : 'body';
        // if parent not found, append to body

    var Id = _.displayPageH (parent, dispOb);

    return Id;

}; // end P.displayPage 

//---------------------
P.genId = () => {

    var id = 'i' + _.id++;
    return id;

}; // end P.genId


// end PUBLIC section

return P;

}());




},{}],2:[function(require,module,exports){
// go-key/index.js

module.exports = function (jqSelector, reportShift, keyHandler) {

// PRIVATE Properties/Methods
var _ = {

    jqSelector: 'body',
    reportShift: false,
    keyHandler: console.log,

    kShift: false,
    kCtrl: false,
    kAlt: false,
    kCmd: false,
    kIgnore: false,
    whichShiftKeys: {16:1, 17:1, 18:1, 91:1, 92:1, 93:1, 224:1},

            // not printable or non-ascii block
    ctrlOrNonAscii: {
        8: 'Backspace',
        9: 'Tab',
        13: 'Enter',
        16: 'Shift',
        17: 'Ctrl',
        18: 'Alt',
        19: 'Pause-break',
        20: 'Caps-lock',
        27: 'Esc',
        32: ' ',  // Space
        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',
        37: 'Left',
        38: 'Up',
        39: 'Right',
        40: 'Down',
        45: 'Insert',
        46: 'Delete',
        91: 'WindowsKeyLeft',
        92: 'WindowsKeyRight',
        93: 'WindowsOptionKey',
        96: '0',  // Numpad
        97: '1',  // Numpad
        98: '2',  // Numpad
        99: '3',  // Numpad
        100: '4',  // Numpad
        101: '5',  // Numpad
        102: '6',  // Numpad
        103: '7',  // Numpad
        104: '8',  // Numpad
        105: '9',  // Numpad
        106: '*',  // Numpad
        107: '+',  // Numpad
        109: '-',  // Numpad
        110: '.',  // Numpad
        111: '/',  // Numpad
        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12',
        144: 'Numlock',
        145: 'Scroll-lock',
        224: 'MacCmd',
    },
    
    
    //---------------------
    asciiUnShifted: {
        48: '0',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5',
        54: '6',
        55: '7',
        56: '8',
        57: '9',
        59: ';',
        61: '=',
        65: 'a',
        66: 'b',
        67: 'c',
        68: 'd',
        69: 'e',
        70: 'f',
        71: 'g',
        72: 'h',
        73: 'i',
        74: 'j',
        75: 'k',
        76: 'l',
        77: 'm',
        78: 'n',
        79: 'o',
        80: 'p',
        81: 'q',
        82: 'r',
        83: 's',
        84: 't',
        85: 'u',
        86: 'v',
        87: 'w',
        88: 'x',
        89: 'y',
        90: 'z',
        173: '-',
        188: ',',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: "\\",
        221: ']',
        222: "'",
    186: ";",  // ditto for ';'
    187: "=",  // apparently, chrome thinks which is 187 for '=', but not firefox
    189: "-",  // ditto for '-'
    },
    
    
    //---------------------
    asciiShifted: {
        48: ')',
        49: '!',
        50: '@',
        51: '#',
        52: '$',
        53: '%',
        54: '^',
        55: '&',
        56: '*',
        57: '(',
        59: ':',
        61: '+',
        65: 'A',
        66: 'B',
        67: 'C',
        68: 'D',
        69: 'E',
        70: 'F',
        71: 'G',
        72: 'H',
        73: 'I',
        74: 'J',
        75: 'K',
        76: 'L',
        77: 'M',
        78: 'N',
        79: 'O',
        80: 'P',
        81: 'Q',
        82: 'R',
        83: 'S',
        84: 'T',
        85: 'U',
        86: 'V',
        87: 'W',
        88: 'X',
        89: 'Y',
        90: 'Z',
        173: '_',
        188: '<',
        190: '>',
        191: '?',
        192: '~',
        219: '{',
        220: '|',
        221: '}',
        222: '"',
    186: ":",  // ditto for ':'
    187: "+",  // ditto for '+'
    189: "_",  // ditto for '-'
    },


}; // end PRIVATE properties
//---------------------
_.init = () => {
    
    _.jqSelector = jqSelector ? jqSelector : 'body';
    _.reportShift = reportShift ? reportShift : false;
    _.keyHandler = keyHandler ? keyHandler : _.defaultHandler;

    P.setKeyUpDown ();

}; // end _.init

//---------------------
_.cKeyDown = (event, reportShift, callback) => {
    // returns ch object reflecting which shift keys were pressed down, ch and which values
    //
    // reportShift true => trigger callback for each keydown event of any key, 
    //                     including any shift key
    //     false => shift key event reported only when the next non-shift keydown event.
    //              So, callback is only triggered for non-shift key events
    
    var which = event.which;

        // never ignore 'Esc' key == 27
    if (_.kIgnore && which != 27) {

        return;

    } // end if (kIgnore)
    
    event.preventDefault();
    event.stopPropagation ();

    var isAShiftKey = true;
    switch (which) {

        case 16: 
            _.kShift = true;
            break;

        case 17: 
            _.kCtrl = true;
            break;

        case 18: 
            _.kAlt = true;
            break;

        case 91: 
        case 92: 
        case 93: 
        case 224:
            _.kCmd = true;
            break;

        default:
            isAShiftKey = false;
            break;

    }   

    if (isAShiftKey && !reportShift) {

        return;

    } // end if (isAShiftKey && !reportShift)
    
    var thisCh = _.getKeyDownCode (which);

    var chOb = ({
        shift: _.kShift,
        ctrl: _.kCtrl,
        alt: _.kAlt,
        macCmd: _.kCmd,
        which: which,
        ch: thisCh,
    });

    if (reportShift) {

        chOb.isAShiftKey = isAShiftKey;  
            // true if any of: shift, ctrl, alt, or macCmd are true
            // only relevant if reportShift is true

    } // end if (reportShift)

    callback (chOb);

}; // end _.cKeyDown 


//---------------------
_.cKeyUp = (event) => {
    

    if (_.kIgnore) {

        return;

    } // end if (kIgnore)
    
    event.preventDefault();
    event.stopPropagation ();

    var which = event.which;

    switch (which) {

        case 16: 
            _.kShift = false;
            return
        case 17: 
            _.kCtrl = false;
            return
        case 18: 
            _.kAlt = false;
            return
        case 91: 
        case 92: 
        case 93: 
        case 224: 
            _.kCmd = false;
            return
    }   

}; // end _.cKeyUp 

//---------------------
_.defaultHandler = (chOb) => {
    
    var chObS = JSON.stringify (chOb);
    console.log ('key._.defaultHandler.chOb: ' + chObS);

}; // end _.defaultHandler 



//---------------------
_.getKeyDownCode = (which) => {
    

    var ch;

    if (_.ctrlOrNonAscii.hasOwnProperty (which)) {

        ch = _.ctrlOrNonAscii [which];

    } else if (_.kShift && _.asciiShifted.hasOwnProperty (which)) {

        ch = _.asciiShifted [which];

    } else if (!_.kShift && _.asciiUnShifted.hasOwnProperty (which)) {

        ch = _.asciiUnShifted [which];

    } else {

        ch = null;

    } // end if 
    
    return ch;

}; // end _.getKeyDownCode 



//---------------------
_.initKeyDown = (jqSelector, reportShift, callback) => {
    
    $(jqSelector)
    .off('keydown')
    .keydown (function (event) {
        _.cKeyDown (event, reportShift, callback);
    })

}; // end _.initKeyDown 


//---------------------
_.initKeyUp = (jqSelector) => {
    
    $(jqSelector)
    .off('keyup')
    .keyup (function (event) {
        _.cKeyUp (event)
    })

}; // end _.initKeyUp 



// PUBLIC Properties/Methods
var P = {};

//---------------------
P.setKeyUpDown = () => {
    
    _.initKeyUp ('body');
    _.initKeyDown ('body', _.reportShift, _.keyHandler);

}; // end P.setKeyHandler

// end PUBLIC section

_.init ();

return P;

};


},{}],3:[function(require,module,exports){

// keyTest.js

(function () {


    $(document).ready (function () {

        var j2h = require ('go-json2html');
        var k = require ('go-key');

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

        k = new k ('body', false, reportKey);
    });

}) ();



},{"go-json2html":1,"go-key":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlc19nbG9iYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9nby1qc29uMmh0bWwvaW5kZXguanMiLCJpbmRleC5qcyIsImtleVRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBnby1qc29uMmh0bWwvaW5kZXguanNcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuXG4vLyBQUklWQVRFIFByb3BlcnRpZXMvTWV0aG9kc1xudmFyIF8gPSB7XG5cbiAgICBpZDogMCxcbiAgICBwcmltaXRpdmVUeXBlc05vdE51bGw6IHsnc3RyaW5nJzoxLCAndW5kZWZpbmVkJzoxLCAnbnVtYmVyJzoxLCAnYm9vbGVhbic6MSwgJ3N5bWJvbCc6IDF9LFxuICAgICAgICAvLyBzaW5jZSB0eXBlb2YgbnVsbCB5aWVsZHMgJ29iamVjdCcsIGl0J3MgaGFuZGxlZCBzZXBhcmF0ZWx5XG5cbn07IC8vIGVuZCBQUklWQVRFIHByb3BlcnRpZXNcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy5kaXNwbGF5UGFnZUggPSAocGFyZW50LCBkaXNwT2IpID0+IHtcbiAgICBcbiAgICBpZiAoZGlzcE9iID09PSAwKSB7XG4gICAgICAgIC8vIGNhc2Ugd2hlcmUgbm8gY29udGVudCBpcyBkZXNpcmVkXG4gICAgICAgIC8vIHRvIGRpc3BsYXkgYW4gYWN0dWFsIHplcm8sIG1ha2UgaXQgYSBzdHJpbmc6ICBcIjBcIlxuXG4gICAgICAgIHJldHVybjtcblxuICAgIH0gLy8gZW5kIGlmIChkaXNwT2IgPT09IDApXG4gICAgXG4gICAgdmFyIGRpc3BPYlR5cGUgPSB0eXBlb2YgZGlzcE9iO1xuICAgIHZhciBpc1ByaW1pdGl2ZSA9IF8ucHJpbWl0aXZlVHlwZXNOb3ROdWxsLmhhc093blByb3BlcnR5IChkaXNwT2JUeXBlKSB8fCBkaXNwT2IgPT09IG51bGw7XG5cbiAgICBpZiAoaXNQcmltaXRpdmUpIHtcblxuICAgICAgICBJZCA9IF8udGV4dE1ha2UgKHBhcmVudCwgZGlzcE9iLCAnYXBwZW5kJyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIE5FID0+IE5vdCBFbXB0eVxuICAgICAgICB2YXIgaXNORUFycmF5ID0gQXJyYXkuaXNBcnJheSAoZGlzcE9iKSAmJiBkaXNwT2IubGVuZ3RoID4gMDtcbiAgICAgICAgdmFyIGlzTkVPYmplY3QgPSAhQXJyYXkuaXNBcnJheShkaXNwT2IpICYmIGRpc3BPYlR5cGUgPT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMoZGlzcE9iKS5sZW5ndGggPiAwO1xuICAgICAgICBcbiAgICAgICAgdmFyIElkID0gbnVsbDtcbiAgICAgICAgICAgIC8vIGNhcGl0YWwgSWQgdG8gaW5kaWNhdGUgaWQgd2l0aCAnIycgcHJlZml4aW5nIGl0XG4gICAgXG4gICAgICAgIGlmIChpc05FT2JqZWN0KSB7XG4gICAgXG4gICAgICAgICAgICBpZiAoZGlzcE9iLmhhc093blByb3BlcnR5ICgncm0nKSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gZGlzcE9iLnJtO1xuICAgICAgICAgICAgICAgICQoc2VsZWN0b3IpXG4gICAgICAgICAgICAgICAgLnJlbW92ZSAoKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdlbXB0eScpKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBkaXNwT2IuZW1wdHk7XG4gICAgICAgICAgICAgICAgJChzZWxlY3RvcilcbiAgICAgICAgICAgICAgICAuZW1wdHkgKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzcE9iLmhhc093blByb3BlcnR5ICgnY29udGVudCcpKSB7XG5cbiAgICAgICAgICAgICAgICBfLmRpc3BsYXlQYWdlSCAocGFyZW50LCBkaXNwT2IuY29udGVudCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzcE9iLmhhc093blByb3BlcnR5ICgnYXR0cicpKSB7XG5cbiAgICAgICAgICAgICAgICAkKHBhcmVudClcbiAgICAgICAgICAgICAgICAuYXR0ciAoZGlzcE9iLmF0dHIpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHt9O1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50TmFtZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzIChkaXNwT2IpO1xuICAgICAgICAgICAgICAgIHZhciBpbnNlcnRMb2NhdGlvbiA9ICdhcHBlbmQnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGt5ID0ga2V5cyBbaV07XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFnVHlwZSA9IF8uZ2V0VGFnVHlwZSAoa3kpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0eWxlSW5IZWFkID0gcGFyZW50ID09PSAnaGVhZCcgJiYga3kgPT09ICdzdHlsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZSBpbiBoZWFkID0+IGh0bWwgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGUgbm90IGluIGhlYWQgPT4gYXR0cmlidXRlIG9mIGRpc3BPYlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWdOb3RTdHlsZSA9IHRhZ1R5cGUgIT09IDAgJiYga3kgIT09ICdzdHlsZSc7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAodGFnTm90U3R5bGUgfHwgc3R5bGVJbkhlYWQpIHtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50TmFtZSA9IGt5O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGRpc3BPYiBbZWxlbWVudE5hbWVdO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChreSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncGFyZW50JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLS0gUHJldmVudHMgJ3BhcmVudCcgZnJvbSBiZWNvbWluZyBhbiBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncHJlcGVuZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXBwZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdiZWZvcmUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FmdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0TG9jYXRpb24gPSBreTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZGlzcE9iIFtreV0gPT09IDEgPyBwYXJlbnQgOiBkaXNwT2IgW2t5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGFueSBvZiBwcmVwZW5kLCAuLi4gYXJlIHNwZWNpZmllZCwgYW5kIHRoZSB2YWx1ZSBpcyBvdGhlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhhbiBhICcxJywgb3ZlcnJpZGUgdGhlIHBhcmVudCB2YWx1ZSB3aXRoIHRoYXQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMgW2t5XSA9IGRpc3BPYiBba3ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmQgc3dpdGNoIChreSlcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmICh0YWdUeXBlICE9PSAwKVxuICAgICAgICBcbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBmb3IgKHZhciBpID0gMDsgaSA8IGtleXM7IGkrKylcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBjYXNlIC0tIHNldCBhcyB0ZXh0IGFuZCBkaXNwbGF5IGVudGlyZSBkaXNwT2JcblxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50TmFtZSA9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IEpTT04uc3RyaW5naWZ5IChkaXNwT2IpO1xuXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgKCFlbGVtZW50TmFtZSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICd0ZXh0Jykge1xuXG4gICAgICAgICAgICAgICAgICAgIElkID0gXy50ZXh0TWFrZSAocGFyZW50LCBjb250ZW50LCBpbnNlcnRMb2NhdGlvbik7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIElkID0gXy5lbGVtZW50TWFrZSAoZWxlbWVudE5hbWUsIHBhcmVudCwgaW5zZXJ0TG9jYXRpb24sIGF0dHJzKTtcblxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmIChlbGVtZW50TmFtZSA9PT0gJ3RleHQnKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChJZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYXNlIGZvciBlbGVtZW50IG5vdCAndGV4dCdcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIF8uZGlzcGxheVBhZ2VIIChJZCwgY29udGVudCk7XG5cbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiAoSWQgIT09IG51bGwpXG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIH0gLy8gZW5kIGlmIChkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdybScpKVxuICAgICAgICAgICAgXG4gICAgXG4gICAgICAgIH0gZWxzZSBpZiAoaXNORUFycmF5KSB7XG4gICAgXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BPYi5sZW5ndGg7IGkrKykge1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm5lZCBJZCB3aWxsIGJlIGZvciBsYXN0IGl0ZW0gaW4gYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgLy8gdXNlZnVsIHRvIGxhdGVyIGFkZCBzaWJsaW5ncyB3aXRoICdhZnRlcicga2V5XG4gICAgICAgICAgICAgICAgSWQgPSBfLmRpc3BsYXlQYWdlSCAocGFyZW50LCBkaXNwT2IgW2ldKTtcbiAgICBcbiAgICAgICAgICAgIH0gLy8gZW5kIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzcE9iLmxlbmd0aDsgaSsrKVxuICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIC8vIGNhc2UgZm9yIGRpc3BPYiBhcyBhbiBlbXB0eSBvYmplY3Qgb3IgZW1wdHkgYXJyYXlcbiAgICBcbiAgICAgICAgfSAvLyBlbmQgaWYgKGlzTkVPYmplY3QpXG5cbiAgICB9IC8vIGVuZCBpZiAoXy5wcmltaXRpdmVUeXBlc05vdE51bGwuaGFzT3duUHJvcGVydHkgKGRpc3BPYlR5cGUpKVxuICAgIFxuICAgICAgICBcbiAgICByZXR1cm4gSWQ7XG5cbn07IC8vIGVuZCBfLmRpc3BsYXlQYWdlSCBcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbl8uZWxlbWVudE1ha2UgPSAodGFnLCBwYXJlbnRPclNpYmwsIGluc2VydExvY2F0aW9uLCBhdHRycykgPT4ge1xuICAgIFxuICAgIHZhciBpZDtcbiAgICB2YXIgYXR0cktleXMgPSBPYmplY3Qua2V5cyAoYXR0cnMpO1xuICAgIHZhciBoYXNBdHRycyA9IGF0dHJLZXlzLmxlbmd0aCA+IDA7XG5cbiAgICBpZiAoaGFzQXR0cnMgJiYgYXR0cnMuaGFzT3duUHJvcGVydHkgKCdpZCcpKSB7XG5cbiAgICAgICAgaWQgPSBhdHRycy5pZDtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgaWQgPSBQLmdlbklkICgpO1xuXG4gICAgfSAvLyBlbmQgaWYgKGhhc0F0dHJzKVxuICAgIFxuICAgIHZhciBJZCA9ICcjJyArIGlkO1xuICAgIFxuICAgIHZhciBkaXZlbCA9ICc8JyArIHRhZyArICcgaWQ9XCInICsgaWQgKyAnXCInO1xuXG4gICAgdmFyIHRhZ3R5cGUgPSBfLmdldFRhZ1R5cGUgKHRhZyk7XG5cbiAgICBpZiAodGFndHlwZSA9PSAxKSB7XG5cbiAgICAgICAgZGl2ZWwgKz0gJz4nO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBkaXZlbCArPSAnPjwvJyArIHRhZyArICc+JztcblxuICAgIH0gLy8gZW5kIGlmICh0YWd0eXBlID09IDEpXG5cbiAgICAkKHBhcmVudE9yU2libClbaW5zZXJ0TG9jYXRpb25dIChkaXZlbCk7XG4gICAgXG4gICAgaWYgKGhhc0F0dHJzKSB7XG4gICAgICAgIFxuICAgICAgICAkKElkKVxuICAgICAgICAuYXR0ciAoYXR0cnMpO1xuXG4gICAgfSAvLyBlbmQgaWYgKGhhc0F0dHJzKVxuICAgIFxuICAgIHJldHVybiBJZDtcblxufTsgLy8gZW5kIF8uZWxlbWVudE1ha2VcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbl8uZ2V0VGFnVHlwZSA9ICh0YWcpID0+IHtcblxuICAgICAgICAvLyAxID0+IHZvaWQgZWxlbWVudHMsIDIgPT4gaGFzIGNvbnRlbnRcbiAgICB2YXIgdGFncyA9IHsgYXJlYTogMSwgYmFzZTogMSwgYnI6IDEsIGNvbDogMSwgZW1iZWQ6IDEsIGhyOiAxLCBpbWc6IDEsIGlucHV0OiAxLCBrZXlnZW46IDEsIGxpbms6IDEsIG1ldGE6IDEsIHBhcmFtOiAxLCBzb3VyY2U6IDEsIHRyYWNrOiAxLCB3YnI6IDEsIGE6IDIsIGFiYnI6IDIsIGFkZHJlc3M6IDIsIGFydGljbGU6IDIsIGFzaWRlOiAyLCBhdWRpbzogMiwgYjogMiwgYmRpOiAyLCBiZG86IDIsIGJsb2NrcXVvdGU6IDIsIGJvZHk6IDIsIGJ1dHRvbjogMiwgY2FudmFzOiAyLCBjYXB0aW9uOiAyLCBjaXRlOiAyLCBjb2RlOiAyLCBjb2xncm91cDogMiwgZGF0YWxpc3Q6IDIsIGRkOiAyLCBkZWw6IDIsIGRldGFpbHM6IDIsIGRmbjogMiwgZGlhbG9nOiAyLCBkaXY6IDIsIGRsOiAyLCBkdDogMiwgZW06IDIsIGZpZWxkc2V0OiAyLCBmaWdjYXB0aW9uOiAyLCBmaWd1cmU6IDIsIGZvb3RlcjogMiwgZm9ybTogMiwgaDE6IDIsIGgyOiAyLCBoMzogMiwgaDQ6IDIsIGg1OiAyLCBoNjogMiwgaGVhZDogMiwgaGVhZGVyOiAyLCBoZ3JvdXA6IDIsIGh0bWw6IDIsIGk6IDIsIGlmcmFtZTogMiwgaW5zOiAyLCBrYmQ6IDIsIGxhYmVsOiAyLCBsZWdlbmQ6IDIsIGxpOiAyLCBtYXA6IDIsIG1hcms6IDIsIG1lbnU6IDIsIG1ldGVyOiAyLCBuYXY6IDIsIG5vc2NyaXB0OiAyLCBvYmplY3Q6IDIsIG9sOiAyLCBvcHRncm91cDogMiwgb3B0aW9uOiAyLCBvdXRwdXQ6IDIsIHA6IDIsIHByZTogMiwgcHJvZ3Jlc3M6IDIsIHE6IDIsIHJwOiAyLCBydDogMiwgcnVieTogMiwgczogMiwgc2FtcDogMiwgc2NyaXB0OiAyLCBzZWN0aW9uOiAyLCBzZWxlY3Q6IDIsIHNtYWxsOiAyLCBzcGFuOiAyLCBzdHJvbmc6IDIsIHN0eWxlOiAyLCBzdWI6IDIsIHN1bW1hcnk6IDIsIHN1cDogMiwgc3ZnOiAyLCB0YWJsZTogMiwgdGJvZHk6IDIsIHRkOiAyLCB0ZXh0YXJlYTogMiwgdGZvb3Q6IDIsIHRoOiAyLCB0aGVhZDogMiwgdGltZTogMiwgdGl0bGU6IDIsIHRyOiAyLCB1OiAyLCB1bDogMiwgJ3Zhcic6IDIsIHZpZGVvOiAyfTtcblxuICAgIHRhZ3MudGV4dCA9IDE7ICAvLyBzcGVjaWFsIHRhZzogIHVzZXMgXy5tYWtlVGV4dCAoKVxuICAgIFxuICAgIHJldHVybiB0YWdzLmhhc093blByb3BlcnR5KHRhZykgPyB0YWdzIFt0YWddIDogMDtcblxufTsgLy8gZW5kIF8uZ2V0VGFnVHlwZSBcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy50ZXh0TWFrZSA9IChwYXJlbnQsIHByaW1pdGl2ZSwgbG9jYXRpb24pID0+IHtcbiAgICBcbiAgICBpZiAodHlwZW9mIHByaW1pdGl2ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBzaW5nbGVxdW90ZSA9ICcmI3gwMDI3Oyc7XG4gICAgICAgIHZhciBiYWNrc2xhc2ggPSAnJiN4MDA1YzsnO1xuICAgICAgICB2YXIgZG91YmxlcXVvdGUgPSAnJiN4MDAyMjsnO1xuICAgICAgICB2YXIgbHQgPSAnJmx0Oyc7XG4gICAgICAgIFxuICAgICAgICBwcmltaXRpdmUgPSBwcmltaXRpdmUucmVwbGFjZSAoLycvZywgc2luZ2xlcXVvdGUpO1xuICAgICAgICBwcmltaXRpdmUgPSBwcmltaXRpdmUucmVwbGFjZSAoL1wiL2csIGRvdWJsZXF1b3RlKTtcbiAgICAgICAgcHJpbWl0aXZlID0gcHJpbWl0aXZlLnJlcGxhY2UgKC9cXFxcL2csIGJhY2tzbGFzaCk7XG4gICAgICAgIHByaW1pdGl2ZSA9IHByaW1pdGl2ZS5yZXBsYWNlICgvPC9nLCBsdCk7XG5cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcmltaXRpdmUgPT09ICdzeW1ib2wnKSB7XG5cbiAgICAgICAgcHJpbWl0aXZlID0gJ3N5bWJvbCc7XG4gICAgICAgICAgICAvLyBvdGhlcndpc2Ugc3RyaW5naWZ5IHdvdWxkIHByb2R1Y2UgJ3t9JyB3aGljaCBpcyBsZXNzIHVzZWZ1bFxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBwcmltaXRpdmUgPSBKU09OLnN0cmluZ2lmeSAocHJpbWl0aXZlKTtcblxuICAgIH0gLy8gZW5kIGlmICh0eXBlb2YgcHJpbWl0aXZlID09PSAnc3RyaW5nJylcbiAgICBcblxuICAgICQocGFyZW50KSBbbG9jYXRpb25dIChwcmltaXRpdmUpO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gICAgICAgIC8vIHRleHQgb2JzIGhhdmUgbm8gaWQnczogb25seSB0ZXh0IGlzIGFwcGVuZGVkIHdpdGggbm8gd2F5IHRvIGFkZHJlc3MgaXRcbiAgICAgICAgLy8gaWYgYWRkcmVzc2luZyBpcyBuZWNlc3NhcnksIHVzZSBzcGFuIGluc3RlYWQgb2YgdGV4dFxuXG59OyAvLyBlbmQgXy50ZXh0TWFrZSBcblxuXG5cbi8vIFBVQkxJQyBQcm9wZXJ0aWVzL01ldGhvZHNcbnZhciBQID0ge307XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLmRpc3BsYXlQYWdlID0gKGRpc3BPYikgPT4ge1xuICAgIFxuICAgIHZhciBwYXJlbnQgPSBkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdwYXJlbnQnKSA/IGRpc3BPYi5wYXJlbnQgOiAnYm9keSc7XG4gICAgICAgIC8vIGlmIHBhcmVudCBub3QgZm91bmQsIGFwcGVuZCB0byBib2R5XG5cbiAgICB2YXIgSWQgPSBfLmRpc3BsYXlQYWdlSCAocGFyZW50LCBkaXNwT2IpO1xuXG4gICAgcmV0dXJuIElkO1xuXG59OyAvLyBlbmQgUC5kaXNwbGF5UGFnZSBcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAuZ2VuSWQgPSAoKSA9PiB7XG5cbiAgICB2YXIgaWQgPSAnaScgKyBfLmlkKys7XG4gICAgcmV0dXJuIGlkO1xuXG59OyAvLyBlbmQgUC5nZW5JZFxuXG5cbi8vIGVuZCBQVUJMSUMgc2VjdGlvblxuXG5yZXR1cm4gUDtcblxufSgpKTtcblxuXG5cbiIsIi8vIGdvLWtleS9pbmRleC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChqcVNlbGVjdG9yLCByZXBvcnRTaGlmdCwga2V5SGFuZGxlcikge1xuXG4vLyBQUklWQVRFIFByb3BlcnRpZXMvTWV0aG9kc1xudmFyIF8gPSB7XG5cbiAgICBqcVNlbGVjdG9yOiAnYm9keScsXG4gICAgcmVwb3J0U2hpZnQ6IGZhbHNlLFxuICAgIGtleUhhbmRsZXI6IGNvbnNvbGUubG9nLFxuXG4gICAga1NoaWZ0OiBmYWxzZSxcbiAgICBrQ3RybDogZmFsc2UsXG4gICAga0FsdDogZmFsc2UsXG4gICAga0NtZDogZmFsc2UsXG4gICAga0lnbm9yZTogZmFsc2UsXG4gICAgd2hpY2hTaGlmdEtleXM6IHsxNjoxLCAxNzoxLCAxODoxLCA5MToxLCA5MjoxLCA5MzoxLCAyMjQ6MX0sXG5cbiAgICAgICAgICAgIC8vIG5vdCBwcmludGFibGUgb3Igbm9uLWFzY2lpIGJsb2NrXG4gICAgY3RybE9yTm9uQXNjaWk6IHtcbiAgICAgICAgODogJ0JhY2tzcGFjZScsXG4gICAgICAgIDk6ICdUYWInLFxuICAgICAgICAxMzogJ0VudGVyJyxcbiAgICAgICAgMTY6ICdTaGlmdCcsXG4gICAgICAgIDE3OiAnQ3RybCcsXG4gICAgICAgIDE4OiAnQWx0JyxcbiAgICAgICAgMTk6ICdQYXVzZS1icmVhaycsXG4gICAgICAgIDIwOiAnQ2Fwcy1sb2NrJyxcbiAgICAgICAgMjc6ICdFc2MnLFxuICAgICAgICAzMjogJyAnLCAgLy8gU3BhY2VcbiAgICAgICAgMzM6ICdQYWdlVXAnLFxuICAgICAgICAzNDogJ1BhZ2VEb3duJyxcbiAgICAgICAgMzU6ICdFbmQnLFxuICAgICAgICAzNjogJ0hvbWUnLFxuICAgICAgICAzNzogJ0xlZnQnLFxuICAgICAgICAzODogJ1VwJyxcbiAgICAgICAgMzk6ICdSaWdodCcsXG4gICAgICAgIDQwOiAnRG93bicsXG4gICAgICAgIDQ1OiAnSW5zZXJ0JyxcbiAgICAgICAgNDY6ICdEZWxldGUnLFxuICAgICAgICA5MTogJ1dpbmRvd3NLZXlMZWZ0JyxcbiAgICAgICAgOTI6ICdXaW5kb3dzS2V5UmlnaHQnLFxuICAgICAgICA5MzogJ1dpbmRvd3NPcHRpb25LZXknLFxuICAgICAgICA5NjogJzAnLCAgLy8gTnVtcGFkXG4gICAgICAgIDk3OiAnMScsICAvLyBOdW1wYWRcbiAgICAgICAgOTg6ICcyJywgIC8vIE51bXBhZFxuICAgICAgICA5OTogJzMnLCAgLy8gTnVtcGFkXG4gICAgICAgIDEwMDogJzQnLCAgLy8gTnVtcGFkXG4gICAgICAgIDEwMTogJzUnLCAgLy8gTnVtcGFkXG4gICAgICAgIDEwMjogJzYnLCAgLy8gTnVtcGFkXG4gICAgICAgIDEwMzogJzcnLCAgLy8gTnVtcGFkXG4gICAgICAgIDEwNDogJzgnLCAgLy8gTnVtcGFkXG4gICAgICAgIDEwNTogJzknLCAgLy8gTnVtcGFkXG4gICAgICAgIDEwNjogJyonLCAgLy8gTnVtcGFkXG4gICAgICAgIDEwNzogJysnLCAgLy8gTnVtcGFkXG4gICAgICAgIDEwOTogJy0nLCAgLy8gTnVtcGFkXG4gICAgICAgIDExMDogJy4nLCAgLy8gTnVtcGFkXG4gICAgICAgIDExMTogJy8nLCAgLy8gTnVtcGFkXG4gICAgICAgIDExMjogJ0YxJyxcbiAgICAgICAgMTEzOiAnRjInLFxuICAgICAgICAxMTQ6ICdGMycsXG4gICAgICAgIDExNTogJ0Y0JyxcbiAgICAgICAgMTE2OiAnRjUnLFxuICAgICAgICAxMTc6ICdGNicsXG4gICAgICAgIDExODogJ0Y3JyxcbiAgICAgICAgMTE5OiAnRjgnLFxuICAgICAgICAxMjA6ICdGOScsXG4gICAgICAgIDEyMTogJ0YxMCcsXG4gICAgICAgIDEyMjogJ0YxMScsXG4gICAgICAgIDEyMzogJ0YxMicsXG4gICAgICAgIDE0NDogJ051bWxvY2snLFxuICAgICAgICAxNDU6ICdTY3JvbGwtbG9jaycsXG4gICAgICAgIDIyNDogJ01hY0NtZCcsXG4gICAgfSxcbiAgICBcbiAgICBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFzY2lpVW5TaGlmdGVkOiB7XG4gICAgICAgIDQ4OiAnMCcsXG4gICAgICAgIDQ5OiAnMScsXG4gICAgICAgIDUwOiAnMicsXG4gICAgICAgIDUxOiAnMycsXG4gICAgICAgIDUyOiAnNCcsXG4gICAgICAgIDUzOiAnNScsXG4gICAgICAgIDU0OiAnNicsXG4gICAgICAgIDU1OiAnNycsXG4gICAgICAgIDU2OiAnOCcsXG4gICAgICAgIDU3OiAnOScsXG4gICAgICAgIDU5OiAnOycsXG4gICAgICAgIDYxOiAnPScsXG4gICAgICAgIDY1OiAnYScsXG4gICAgICAgIDY2OiAnYicsXG4gICAgICAgIDY3OiAnYycsXG4gICAgICAgIDY4OiAnZCcsXG4gICAgICAgIDY5OiAnZScsXG4gICAgICAgIDcwOiAnZicsXG4gICAgICAgIDcxOiAnZycsXG4gICAgICAgIDcyOiAnaCcsXG4gICAgICAgIDczOiAnaScsXG4gICAgICAgIDc0OiAnaicsXG4gICAgICAgIDc1OiAnaycsXG4gICAgICAgIDc2OiAnbCcsXG4gICAgICAgIDc3OiAnbScsXG4gICAgICAgIDc4OiAnbicsXG4gICAgICAgIDc5OiAnbycsXG4gICAgICAgIDgwOiAncCcsXG4gICAgICAgIDgxOiAncScsXG4gICAgICAgIDgyOiAncicsXG4gICAgICAgIDgzOiAncycsXG4gICAgICAgIDg0OiAndCcsXG4gICAgICAgIDg1OiAndScsXG4gICAgICAgIDg2OiAndicsXG4gICAgICAgIDg3OiAndycsXG4gICAgICAgIDg4OiAneCcsXG4gICAgICAgIDg5OiAneScsXG4gICAgICAgIDkwOiAneicsXG4gICAgICAgIDE3MzogJy0nLFxuICAgICAgICAxODg6ICcsJyxcbiAgICAgICAgMTkwOiAnLicsXG4gICAgICAgIDE5MTogJy8nLFxuICAgICAgICAxOTI6ICdgJyxcbiAgICAgICAgMjE5OiAnWycsXG4gICAgICAgIDIyMDogXCJcXFxcXCIsXG4gICAgICAgIDIyMTogJ10nLFxuICAgICAgICAyMjI6IFwiJ1wiLFxuICAgIDE4NjogXCI7XCIsICAvLyBkaXR0byBmb3IgJzsnXG4gICAgMTg3OiBcIj1cIiwgIC8vIGFwcGFyZW50bHksIGNocm9tZSB0aGlua3Mgd2hpY2ggaXMgMTg3IGZvciAnPScsIGJ1dCBub3QgZmlyZWZveFxuICAgIDE4OTogXCItXCIsICAvLyBkaXR0byBmb3IgJy0nXG4gICAgfSxcbiAgICBcbiAgICBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFzY2lpU2hpZnRlZDoge1xuICAgICAgICA0ODogJyknLFxuICAgICAgICA0OTogJyEnLFxuICAgICAgICA1MDogJ0AnLFxuICAgICAgICA1MTogJyMnLFxuICAgICAgICA1MjogJyQnLFxuICAgICAgICA1MzogJyUnLFxuICAgICAgICA1NDogJ14nLFxuICAgICAgICA1NTogJyYnLFxuICAgICAgICA1NjogJyonLFxuICAgICAgICA1NzogJygnLFxuICAgICAgICA1OTogJzonLFxuICAgICAgICA2MTogJysnLFxuICAgICAgICA2NTogJ0EnLFxuICAgICAgICA2NjogJ0InLFxuICAgICAgICA2NzogJ0MnLFxuICAgICAgICA2ODogJ0QnLFxuICAgICAgICA2OTogJ0UnLFxuICAgICAgICA3MDogJ0YnLFxuICAgICAgICA3MTogJ0cnLFxuICAgICAgICA3MjogJ0gnLFxuICAgICAgICA3MzogJ0knLFxuICAgICAgICA3NDogJ0onLFxuICAgICAgICA3NTogJ0snLFxuICAgICAgICA3NjogJ0wnLFxuICAgICAgICA3NzogJ00nLFxuICAgICAgICA3ODogJ04nLFxuICAgICAgICA3OTogJ08nLFxuICAgICAgICA4MDogJ1AnLFxuICAgICAgICA4MTogJ1EnLFxuICAgICAgICA4MjogJ1InLFxuICAgICAgICA4MzogJ1MnLFxuICAgICAgICA4NDogJ1QnLFxuICAgICAgICA4NTogJ1UnLFxuICAgICAgICA4NjogJ1YnLFxuICAgICAgICA4NzogJ1cnLFxuICAgICAgICA4ODogJ1gnLFxuICAgICAgICA4OTogJ1knLFxuICAgICAgICA5MDogJ1onLFxuICAgICAgICAxNzM6ICdfJyxcbiAgICAgICAgMTg4OiAnPCcsXG4gICAgICAgIDE5MDogJz4nLFxuICAgICAgICAxOTE6ICc/JyxcbiAgICAgICAgMTkyOiAnficsXG4gICAgICAgIDIxOTogJ3snLFxuICAgICAgICAyMjA6ICd8JyxcbiAgICAgICAgMjIxOiAnfScsXG4gICAgICAgIDIyMjogJ1wiJyxcbiAgICAxODY6IFwiOlwiLCAgLy8gZGl0dG8gZm9yICc6J1xuICAgIDE4NzogXCIrXCIsICAvLyBkaXR0byBmb3IgJysnXG4gICAgMTg5OiBcIl9cIiwgIC8vIGRpdHRvIGZvciAnLSdcbiAgICB9LFxuXG5cbn07IC8vIGVuZCBQUklWQVRFIHByb3BlcnRpZXNcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5fLmluaXQgPSAoKSA9PiB7XG4gICAgXG4gICAgXy5qcVNlbGVjdG9yID0ganFTZWxlY3RvciA/IGpxU2VsZWN0b3IgOiAnYm9keSc7XG4gICAgXy5yZXBvcnRTaGlmdCA9IHJlcG9ydFNoaWZ0ID8gcmVwb3J0U2hpZnQgOiBmYWxzZTtcbiAgICBfLmtleUhhbmRsZXIgPSBrZXlIYW5kbGVyID8ga2V5SGFuZGxlciA6IF8uZGVmYXVsdEhhbmRsZXI7XG5cbiAgICBQLnNldEtleVVwRG93biAoKTtcblxufTsgLy8gZW5kIF8uaW5pdFxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy5jS2V5RG93biA9IChldmVudCwgcmVwb3J0U2hpZnQsIGNhbGxiYWNrKSA9PiB7XG4gICAgLy8gcmV0dXJucyBjaCBvYmplY3QgcmVmbGVjdGluZyB3aGljaCBzaGlmdCBrZXlzIHdlcmUgcHJlc3NlZCBkb3duLCBjaCBhbmQgd2hpY2ggdmFsdWVzXG4gICAgLy9cbiAgICAvLyByZXBvcnRTaGlmdCB0cnVlID0+IHRyaWdnZXIgY2FsbGJhY2sgZm9yIGVhY2gga2V5ZG93biBldmVudCBvZiBhbnkga2V5LCBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGluZyBhbnkgc2hpZnQga2V5XG4gICAgLy8gICAgIGZhbHNlID0+IHNoaWZ0IGtleSBldmVudCByZXBvcnRlZCBvbmx5IHdoZW4gdGhlIG5leHQgbm9uLXNoaWZ0IGtleWRvd24gZXZlbnQuXG4gICAgLy8gICAgICAgICAgICAgIFNvLCBjYWxsYmFjayBpcyBvbmx5IHRyaWdnZXJlZCBmb3Igbm9uLXNoaWZ0IGtleSBldmVudHNcbiAgICBcbiAgICB2YXIgd2hpY2ggPSBldmVudC53aGljaDtcblxuICAgICAgICAvLyBuZXZlciBpZ25vcmUgJ0VzYycga2V5ID09IDI3XG4gICAgaWYgKF8ua0lnbm9yZSAmJiB3aGljaCAhPSAyNykge1xuXG4gICAgICAgIHJldHVybjtcblxuICAgIH0gLy8gZW5kIGlmIChrSWdub3JlKVxuICAgIFxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uICgpO1xuXG4gICAgdmFyIGlzQVNoaWZ0S2V5ID0gdHJ1ZTtcbiAgICBzd2l0Y2ggKHdoaWNoKSB7XG5cbiAgICAgICAgY2FzZSAxNjogXG4gICAgICAgICAgICBfLmtTaGlmdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDE3OiBcbiAgICAgICAgICAgIF8ua0N0cmwgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAxODogXG4gICAgICAgICAgICBfLmtBbHQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSA5MTogXG4gICAgICAgIGNhc2UgOTI6IFxuICAgICAgICBjYXNlIDkzOiBcbiAgICAgICAgY2FzZSAyMjQ6XG4gICAgICAgICAgICBfLmtDbWQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlzQVNoaWZ0S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcblxuICAgIH0gICBcblxuICAgIGlmIChpc0FTaGlmdEtleSAmJiAhcmVwb3J0U2hpZnQpIHtcblxuICAgICAgICByZXR1cm47XG5cbiAgICB9IC8vIGVuZCBpZiAoaXNBU2hpZnRLZXkgJiYgIXJlcG9ydFNoaWZ0KVxuICAgIFxuICAgIHZhciB0aGlzQ2ggPSBfLmdldEtleURvd25Db2RlICh3aGljaCk7XG5cbiAgICB2YXIgY2hPYiA9ICh7XG4gICAgICAgIHNoaWZ0OiBfLmtTaGlmdCxcbiAgICAgICAgY3RybDogXy5rQ3RybCxcbiAgICAgICAgYWx0OiBfLmtBbHQsXG4gICAgICAgIG1hY0NtZDogXy5rQ21kLFxuICAgICAgICB3aGljaDogd2hpY2gsXG4gICAgICAgIGNoOiB0aGlzQ2gsXG4gICAgfSk7XG5cbiAgICBpZiAocmVwb3J0U2hpZnQpIHtcblxuICAgICAgICBjaE9iLmlzQVNoaWZ0S2V5ID0gaXNBU2hpZnRLZXk7ICBcbiAgICAgICAgICAgIC8vIHRydWUgaWYgYW55IG9mOiBzaGlmdCwgY3RybCwgYWx0LCBvciBtYWNDbWQgYXJlIHRydWVcbiAgICAgICAgICAgIC8vIG9ubHkgcmVsZXZhbnQgaWYgcmVwb3J0U2hpZnQgaXMgdHJ1ZVxuXG4gICAgfSAvLyBlbmQgaWYgKHJlcG9ydFNoaWZ0KVxuXG4gICAgY2FsbGJhY2sgKGNoT2IpO1xuXG59OyAvLyBlbmQgXy5jS2V5RG93biBcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy5jS2V5VXAgPSAoZXZlbnQpID0+IHtcbiAgICBcblxuICAgIGlmIChfLmtJZ25vcmUpIHtcblxuICAgICAgICByZXR1cm47XG5cbiAgICB9IC8vIGVuZCBpZiAoa0lnbm9yZSlcbiAgICBcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbiAoKTtcblxuICAgIHZhciB3aGljaCA9IGV2ZW50LndoaWNoO1xuXG4gICAgc3dpdGNoICh3aGljaCkge1xuXG4gICAgICAgIGNhc2UgMTY6IFxuICAgICAgICAgICAgXy5rU2hpZnQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBjYXNlIDE3OiBcbiAgICAgICAgICAgIF8ua0N0cmwgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBjYXNlIDE4OiBcbiAgICAgICAgICAgIF8ua0FsdCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGNhc2UgOTE6IFxuICAgICAgICBjYXNlIDkyOiBcbiAgICAgICAgY2FzZSA5MzogXG4gICAgICAgIGNhc2UgMjI0OiBcbiAgICAgICAgICAgIF8ua0NtZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgfSAgIFxuXG59OyAvLyBlbmQgXy5jS2V5VXAgXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5fLmRlZmF1bHRIYW5kbGVyID0gKGNoT2IpID0+IHtcbiAgICBcbiAgICB2YXIgY2hPYlMgPSBKU09OLnN0cmluZ2lmeSAoY2hPYik7XG4gICAgY29uc29sZS5sb2cgKCdrZXkuXy5kZWZhdWx0SGFuZGxlci5jaE9iOiAnICsgY2hPYlMpO1xuXG59OyAvLyBlbmQgXy5kZWZhdWx0SGFuZGxlciBcblxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5fLmdldEtleURvd25Db2RlID0gKHdoaWNoKSA9PiB7XG4gICAgXG5cbiAgICB2YXIgY2g7XG5cbiAgICBpZiAoXy5jdHJsT3JOb25Bc2NpaS5oYXNPd25Qcm9wZXJ0eSAod2hpY2gpKSB7XG5cbiAgICAgICAgY2ggPSBfLmN0cmxPck5vbkFzY2lpIFt3aGljaF07XG5cbiAgICB9IGVsc2UgaWYgKF8ua1NoaWZ0ICYmIF8uYXNjaWlTaGlmdGVkLmhhc093blByb3BlcnR5ICh3aGljaCkpIHtcblxuICAgICAgICBjaCA9IF8uYXNjaWlTaGlmdGVkIFt3aGljaF07XG5cbiAgICB9IGVsc2UgaWYgKCFfLmtTaGlmdCAmJiBfLmFzY2lpVW5TaGlmdGVkLmhhc093blByb3BlcnR5ICh3aGljaCkpIHtcblxuICAgICAgICBjaCA9IF8uYXNjaWlVblNoaWZ0ZWQgW3doaWNoXTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgY2ggPSBudWxsO1xuXG4gICAgfSAvLyBlbmQgaWYgXG4gICAgXG4gICAgcmV0dXJuIGNoO1xuXG59OyAvLyBlbmQgXy5nZXRLZXlEb3duQ29kZSBcblxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5fLmluaXRLZXlEb3duID0gKGpxU2VsZWN0b3IsIHJlcG9ydFNoaWZ0LCBjYWxsYmFjaykgPT4ge1xuICAgIFxuICAgICQoanFTZWxlY3RvcilcbiAgICAub2ZmKCdrZXlkb3duJylcbiAgICAua2V5ZG93biAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIF8uY0tleURvd24gKGV2ZW50LCByZXBvcnRTaGlmdCwgY2FsbGJhY2spO1xuICAgIH0pXG5cbn07IC8vIGVuZCBfLmluaXRLZXlEb3duIFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5fLmluaXRLZXlVcCA9IChqcVNlbGVjdG9yKSA9PiB7XG4gICAgXG4gICAgJChqcVNlbGVjdG9yKVxuICAgIC5vZmYoJ2tleXVwJylcbiAgICAua2V5dXAgKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBfLmNLZXlVcCAoZXZlbnQpXG4gICAgfSlcblxufTsgLy8gZW5kIF8uaW5pdEtleVVwIFxuXG5cblxuLy8gUFVCTElDIFByb3BlcnRpZXMvTWV0aG9kc1xudmFyIFAgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAuc2V0S2V5VXBEb3duID0gKCkgPT4ge1xuICAgIFxuICAgIF8uaW5pdEtleVVwICgnYm9keScpO1xuICAgIF8uaW5pdEtleURvd24gKCdib2R5JywgXy5yZXBvcnRTaGlmdCwgXy5rZXlIYW5kbGVyKTtcblxufTsgLy8gZW5kIFAuc2V0S2V5SGFuZGxlclxuXG4vLyBlbmQgUFVCTElDIHNlY3Rpb25cblxuXy5pbml0ICgpO1xuXG5yZXR1cm4gUDtcblxufTtcblxuIiwiXG4vLyBrZXlUZXN0LmpzXG5cbihmdW5jdGlvbiAoKSB7XG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5IChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGoyaCA9IHJlcXVpcmUgKCdnby1qc29uMmh0bWwnKTtcbiAgICAgICAgdmFyIGsgPSByZXF1aXJlICgnZ28ta2V5Jyk7XG5cbiAgICAgICAgdmFyIGRwcCA9IGoyaC5kaXNwbGF5UGFnZTtcbiAgICAgICAgdmFyIGdlbklkID0gajJoLmdlbklkO1xuXG4gICAgICAgIHZhciBpZCA9IGdlbklkICgpO1xuICAgICAgICBkcHAgKHtkaXY6IFtcbiAgICAgICAgICAgIHtsYWJlbDogJ2tleSBkb3duIGV2ZW50Jywgc3R5bGU6IFwiYmFja2dyb3VuZC1jb2xvcjogI2ZmY2NjYztcIn0sIFxuICAgICAgICAgICAge3ByZToge1xuICAgICAgICAgICAgICAgIHNwYW46ICdwcmVzcyBhbnkgc2hpZnQva2V5IGNvbWJpbmF0aW9uJywgXG4gICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICB9LCBzdHlsZTogXCJtYXJnaW46IDA7XCJ9XG4gICAgICAgIF0sIHN0eWxlOiBcImJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XCIgK1xuICAgICAgICAgICAgXCJib3JkZXItcmFkaXVzOiA0cHg7XCIgK1xuICAgICAgICAgICAgXCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XCIgK1xuICAgICAgICAgICAgXCJwYWRkaW5nOiA0cHg7XCJ9KTtcblxuICAgICAgICB2YXIgSWQgPSAnIycgKyBpZDtcbiAgICAgICAgICAgIC8vIGpxdWVyeSBhZGRyZXNzYWJsZVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlcG9ydEtleSAoY2hPYikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2VlSXQgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgbmwgPSBcIlwiO1xuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBjaE9iKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2VlSXQgKz0gbmwgKyBrICsgJzogJyArIGNoT2Jba107XG4gICAgICAgICAgICAgICAgbmwgPSAnXFxuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJChJZClcbiAgICAgICAgICAgIC5lbXB0eSAoKVxuICAgICAgICAgICAgLmFwcGVuZCAoc2VlSXQpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgayA9IG5ldyBrICgnYm9keScsIGZhbHNlLCByZXBvcnRLZXkpO1xuICAgIH0pO1xuXG59KSAoKTtcblxuXG4iXX0=
