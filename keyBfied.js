(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// dbl-click/index.js

module.exports = function (p0) {

const v = {

    sel: p0.sel,
    singleCb: p0.singleCb,
    doubleCb: p0.doubleCb,
    DELAY: p0.delay ? p0.delay : 300,
    timer: null,

};

const A = {};


//---------------------
A.init = () => {

        // solution: use timer to prevent single click from firing when double click fires
        // https://css-tricks.com/snippets/javascript/bind-different-events-to-click-and-double-click/

    const sel = $(v.sel);

    const isTouch = 'ontouchstart' in window;
    if (isTouch) {

        sel.on ('touchend', function (evt) {
            f.doClkTouchEvent (evt);
        });

    } else {

        sel.click (function (evt) {
            f.doClkTouchEvent (evt);
        });

    } // end if (isTouch)
    

}; // end A.init

const f = {};

//---------------------
f.doClkTouchEvent = (evt) => {
    
    const Id = '#' + evt.target.id;

    $('*')
    .blur ();
        // removes evil blue border

    if (v.timer) {

            // $('body').prepend (`dClk.Dbl.Id=${Id}...`);
        clearTimeout (v.timer);
        v.timer = null;
        return v.doubleCb (Id);

    } else {

        v.timer = setTimeout (function () {

                // $('body').prepend (`dClk.Sgl.Id=${Id}...`);
            v.timer = null;
            if (v.singleCb !== null) {

                return v.singleCb (Id);

            } // end if (v.singleCb !== null)
            
        }, v.DELAY);

    } // end if (clicked)

}; // end f.doClkTouchEvent 


A.init ();

};




},{}],2:[function(require,module,exports){
// go-j2h/index.js

module.exports = (function () {

// PRIVATE Properties/Methods
const v = {

    id: 0,
    primitiveTypesNotNull: {'string':1, 'number':1, 'boolean':1, 'symbol': 1},
        // since typeof null yields 'object', it's handled separately

    msgTypes: {

        primary: {
                // void tags
            area: 0, base: 0, br: 0, col: 0, embed: 0, hr: 0, img: 0, input: 0, keygen: 0, link: 0, meta: 0, param: 0, source: 0, track: 0, wbr: 0, 

                // non-void tags
            a: 1, abbr: 1, address: 1, article: 1, aside: 1, audio: 1, b: 1, bdi: 1, bdo: 1, blockquote: 1, body: 1, button: 1, canvas: 1, caption: 1, cite: 1, code: 1, colgroup: 1, datalist: 1, dd: 1, del: 1, details: 1, dfn: 1, dialog: 1, div: 1, dl: 1, dt: 1, em: 1, fieldset: 1, figcaption: 1, figure: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, head: 1, header: 1, hgroup: 1, html: 1, i: 1, iframe: 1, ins: 1, kbd: 1, label: 1, legend: 1, li: 1, map: 1, mark: 1, menu: 1, meter: 1, nav: 1, noscript: 1, object: 1, ol: 1, optgroup: 1, option: 1, output: 1, p: 1, pre: 1, progress: 1, q: 1, rp: 1, rt: 1, ruby: 1, s: 1, samp: 1, script: 1, section: 1, select: 1, small: 1, span: 1, strong: 1, style: 1, sub: 1, summary: 1, sup: 1, svg: 1, table: 1, tbody: 1, td: 1, textarea: 1, tfoot: 1, th: 1, thead: 1, time: 1, title: 1, tr: 1, u: 1, ul: 1, 'var': 1, video: 1,
        },

        secondary: {style: 1},
            // elements that can be either a primary tag itself or an attribute of another primary tag
            // if any other primary tags is present, then secondary tags are treated as
            // attributes of the other primary tag

        meta: {
            sel: 1,
                // sel => add events to existing selector
                // presumes there is no primary key (else would
                // be adding a new element, not modifying existing)
            empty: 1, rm: 1, 
            prepend: 1, append: 1, before: 1, after: 1, parent: 1,
            attr: 1, content: 1, text: 1, 
            clk: 1, dclk: 1, hin: 1, hot: 1, sbt:1, gox: 1,
                // define click, double-click, hoverIn, hoverOut and submit callbacks
            evt:1,
                // local evt ctrl => overrides v.evtIsOn status
        },

    },

    dblClick: require ('dbl-click'),
    goX0: require ('go-x2'),
    dblClickDelay: 700,

    msg0: require ('go-msg'),
    msg: null,

    evtIsOn: true,
    isTouch: false,

}; // end PRIVATE properties
const A={};
const f={};

//---------------------
A.init = () => {
    
    v.msg = new v.msg0 (v.msgTypes);

    v.isTouch = 'ontouchstart' in window;

}; // end A.init


//---------------------
f.attr = (selector, attr) => {
    
    $(selector)
    .attr (attr);

}; // end f.attr 


//---------------------
f.empty = (selector) => {
    
    $(selector)
    .empty ()
    .off ('keydown');

}; // end f.empty 



//---------------------
f.rm = (selector) => {

    $(selector)
    .remove ();

}; // end f.rm


//---------------------
f.displayObH = (parent, dispOb) => {
    
        // ----  doArray ----
    const doArray = function (dispOb) {

        const Ids = [];
        for (let i = 0; i < dispOb.length; i++) {

            Ids.push (f.displayObH (parent, dispOb [i]));

        } // end for (let i = 0; i < dispOb.length; i++)

        return Ids [Ids.length - 1];
        //return Ids;
        
    };  // end doArray 

        // ----  doObject ----
    const doObject = function (dispOb) {

        const dispObParsed = v.msg.parseMsg (dispOb);

        const primaryKey = dispObParsed.p;

        const meta = dispObParsed.m;

        let relLoc = 'append';

        let [sel, delKey, attr, content, text, clk, dclk, hin, hot, sbt, gox] = new Array (11).fill (null);


        if (meta.hasOwnProperty ('parent')) {
            // ensures processing of 'parent' before remainder of meta keys

            parent = meta.parent;
            delete meta.parent;

        } // end if (meta.hasOwnProperty ('parent'))
        
        let evtIsOn = v.evtIsOn;

        const metaKeys = Object.keys (meta);
        for (let idx = 0; idx < metaKeys.length; idx++) {

            const key = metaKeys [idx];
            switch (key) {

                case 'sel':
                    sel = meta.sel;
                    break;

                case 'empty':
                case 'rm':
                    delKey = key;
                    parent = meta [key];
                    break;

                case 'attr':
                    attr = meta.attr;
                    break;

                case 'content':
                    content = meta.content;
                    break;
                case 'text':
                    text = meta.text;
                    break;

                case 'prepend':
                case 'append':
                case 'before':
                case 'after':
                    relLoc = key;
                    const val = meta [key];
                    const doParent = val !== 1 && val !== true;
                    parent = doParent ? val : parent;
                        // if val is other than 1 or true, relLoc overrides both parent values passed 
                        // into displayObH and defined by optional parent attribute
                    break;

                case 'clk':
                    clk = function (Id) {
                            // Id Only valid if in dclk context
                        Id = typeof Id === 'string' ? Id : '#' + Id.target.id;
                        $(Id)
                        .blur ();
                        return meta.clk (Id);
                        //return false;
                    };
                    break;

                case 'dclk':
                    dclk = function (Id) {
                        $(Id)
                        .blur ();
                        return meta.dclk (Id);
                    };
                    break;

                case 'hin':
                    hin = function (Id) {
                        return meta.hin (Id);
                    };
                    break;

                case 'hot':
                    hot = function (Id) {
                        return meta.hot (Id);
                    };
                    break;

                case 'sbt':
                    sbt = function () {
                        const formFields = $(this).serialize ();
                        meta.sbt (formFields);

                        return false;
                            // for forms, always return false
                    };
                    break;

                case 'evt':
                    evtIsOn = meta.evt;
                    break;

                case 'gox':
                    gox = meta.gox;
                        // gox value is deleteCb function that gets
                        // called when X is clicked
                    break;
            } // end switch (key)
            

        } // end for (let idx = 0; idx < metaKeys.length; idx++)
        

        Id = null;

        if (delKey) {

            f [delKey] (parent);

        } else if (attr) {

            f.attr (parent, attr);

        } else if (content) {
            // replaces entire content of parent with new content

            $(parent)
            .empty ();

            f.displayObH (parent, content);
                // without emptying first, will simply append content to existing content

        } else if (text) {

            Id = f.textMake (parent, relLoc, text);

        } else {

            if (sel) {

                Id = sel;

            } else {

                Id = f.elementMake (parent, relLoc, primaryKey, dispObParsed.c, dispObParsed.s);

            } // end if (sel)
            

            if (evtIsOn) {

                if (dclk) {
                    
                    new v.dblClick ({
                        sel: Id,
                        singleCb: clk ? clk : null,
                        doubleCb: dclk,
                        delay: v.dblClickDelay,
                    });

                } else if (clk) {
    
//                    $(Id)
//                    .click (clk);
                    const clkId = $(Id);
                    if (v.isTouch) {

                        clkId.on ('touchend', function () {
                            return clk (Id);
                        });

                    } else {

                        clkId.click (function () {
                            return clk (Id);
                        });

                    } // end if (v.isTouch)
                    
//                    $(Id)
//                    .click (function () {
//                        return clk (Id);
//                    })
//                    .on ('touchstart', function () {
//P.displayOb ({text: 'touchstart...', prepend: 'body'});
//                        clk (Id);
//                        return false;
//                    });
    
                } // end if (clk)
    
                if (hin) {
    
                    $(Id)
                    .mouseenter (function (evt) {
                        const Id = '#' + evt.target.id;
                        return hin (Id);
                    });
    
                } // end if (hin)
                
                if (hot) {
    
                    $(Id)
                    .mouseleave (function (evt) {
                        const Id = '#' + evt.target.id;
                        return hot (Id);
                    });
    
                } // end if (hin)
                
                if (sbt) {
    
                    $(Id)
                    .submit (sbt);
                        // 'this' is totally different
                        // compared to 'this'
                        // with this construct:
                        //.submit (function () {
                            //sbt ();
                            //return false;
                        //});
    
                } // end if (hin)

                if (gox) {

                    new v.goX0 ({
                        jqSel: Id,
                        dpp: P.displayObA,
                        deleteCb: typeof gox === 'function' ? gox : null,
                    });

                } // end if (gox)
                
                

            } // end if (evtIsOn)
            
        } // end if (delKey)

        return Id;
        
    };  // end doObject 



       // ---- main ----
    let Id;
    const dispObType = typeof dispOb;

    if (dispObType === 'undefined' || dispOb === 0 || dispOb === null) {

        Id = null;

    } else if (v.primitiveTypesNotNull.hasOwnProperty (dispObType)) {

        Id = f.textMake (parent, 'append', dispOb);
            // if text should be placed at other than 'append' location, then use
            // 'text' tag and specify prepend, after or before as needed

    } else if (Array.isArray (dispOb)) {

        Id = doArray (dispOb);

    } else if (dispObType == 'object') {

        Id = doObject (dispOb);

    } else {

        Id = null;

    } // end if (typeof dispOb === 'undefined' || dispOb === 0 || dispOb === null)
    
    return Id;

}; // end f.displayObH 

//---------------------
f.elementMake = (parentOrSiblId, relLoc, elName, content, attrs) => {
    
    let id;
    const attrKeys = Object.keys (attrs);
    const hasAttrs = attrKeys.length > 0;

    if (hasAttrs && attrs.hasOwnProperty ('id')) {

        id = attrs.id;

    } else {

        id = P.genId ();

    } // end if (hasAttrs)
    
    const Id = '#' + id;
    
    if (elName === 'script' && content !== 0) {
        // https://stackoverflow.com/questions/9413737/how-to-append-script-script-in-javascript
        // inspired by SO question, but setting innerHTML isn't supposed to work
        // therefore, set src attribute with path to file, instead of 
        // setting innerHTML to content of file

        // https://stackoverflow.com/questions/610995/cant-append-script-element
        // jQuery won't add script element as it does with any other element.  Therefore, must be done
        // using only javascript as follows:
        const script = document.createElement("script");

        script.src = content;
        script.id = attrs.id;
        
        document.head.appendChild(script);     

    } else {

        let divel = '<' + elName + ' id="' + id + '"';
    
        if (content) {
    
            divel += '></' + elName + '>';
    
        } else {
    
            divel += '>';
    
        } // end if (content)
    
        $(parentOrSiblId)[relLoc] (divel);

    } // end if (elName === 'script')
    
    
    if (hasAttrs) {
        
        $(Id)
        .attr (attrs);

    } // end if (hasAttrs)

    f.displayObH (Id, content);
    
    if (elName === 'form') {

        $(parent)
        .focus ();

    } // end if (elName === 'form')
    
    return Id;

}; // end f.elementMake


//---------------------
f.textMake = (parent, relLoc, primitive) => {
    
//    const isBuffer = typeof primitive === 'object' && primitive.type === 'Buffer';
//
//    if (isBuffer) {
//
//        primitive = primitive.data.toString ();
//
//    } // end if (isBuffer)
    

    if (typeof primitive === 'string') {
        
        const singlequote = '&#x0027;';
        const backslash = '&#x005c;';
        const doublequote = '&#x0022;';
        const lt = '&lt;';
        
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
    

    $(parent) [relLoc] (primitive);

    return null;
        // text obs have no id's: only text is appended with no way to address it
        // if addressing is necessary, use span instead of text

}; // end f.textMake 



// PUBLIC Properties/Methods
const P = {};

//---------------------
P.displayOb = (dispOb) => {
    // if dispOb is an array, only the last Id is returned
    
    let parent = 'body';
        // if parent not found, append to body

    if (typeof dispOb === 'object' && dispOb.hasOwnProperty ('parent')) {

        parent = dispOb.parent;

    } // end if (typeof dispOb === 'object' && dispOb.hasOwnProperty ('parent'))
    
    const Id = f.displayObH (parent, dispOb);

    return Id;

}; // end P.displayOb 

//---------------------
P.displayObA = (dispObA) => {
    // this is the way displayOb should have been written in the first place, to always
    // return an array if Ids, if the argument is an array
    
    let Ids;
    if (Array.isArray (dispObA)) {

        const parent = dispObA.hasOwnProperty ('parent') ? dispObA.parent : 'body';

        Ids = [];
        for (let ix = 0; ix < dispObA.length; ix++) {

            const dispOb = dispObA [ix];
            let parentI = parent;

            if (typeof dispOb === 'object' && dispOb.hasOwnProperty ('parent')) {

                parentI = dispOb.parent;

            } // end if (typeof dispOb === 'object')
            
            Ids.push (f.displayObH (parentI, dispOb));

        } // end for (let ix = 0; ix < dispObA.length; ix++)

    } else {

        Ids = P.displayOb (dispObA);

    } // end if (Array.isArray (dispObA))
    
    return Ids;

}; // end P.displayObA 


P.displayPage = P.displayOb;

//---------------------
P.doubleClickDelay = (delay) => {
    
    v.dblClickDelay = delay;

}; // end P.doubleClickDelay 


//---------------------
P.evtOn = () => {
    
    v.evtIsOn = true;

}; // end P.evtOn


//---------------------
P.evtOff = () => {
    
    v.evtIsOn = false;

}; // end P.evtOff


//---------------------
P.genId = (ob) => {

    const id = 'i' + v.id++;

    if (ob) {

        ob.id = id;

    } // end if (ob)
    
    return id;

}; // end P.genId


//---------------------
P.genIds = (ob) => {
    
    const id = ob ? P.genId (ob) : P.genId ();
    const Id = '#' + id;

    return [id, Id];

}; // end P.genIds

//---------------------
P.IdGen = (ob) => {
    
    const Id = P.genIds (ob) [1];
    return Id;

}; // end P.IdGen 



A.init ();

return P;

}());




},{"dbl-click":1,"go-msg":5,"go-x2":6}],3:[function(require,module,exports){
// go-key/index.js

module.exports = function (jqSelector, reportShift, keyDownHandler, reportUp, keyUpHandler, allowPropagation) {

// PRIVATE Properties/Methods
const v = {

    jqSelector: 'body',
    reportShift: false,
    keyDownHandler: null,
    reportUp: false,
    keyUpHandler: null,

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
const A = {};
//---------------------
A.init = () => {
    
    v.jqSelector = jqSelector ? jqSelector : 'body';
    v.reportShift = reportShift ? reportShift : false;
    v.keyDownHandler = keyDownHandler ? keyDownHandler : f.defaultHandler;
    v.reportUp = reportUp ? reportUp : false;
    v.keyUpHandler = keyUpHandler ? keyUpHandler : f.defaultHandler;
    v.allowPropagation = allowPropagation;

    //P.setKeyOn (v.jqSelector);
    P.setKeyOn ();
    if (typeof _m0 === 'undefined') {

        _m0 = {};

    } // end if (typeof _m0 === 'undefined')
    
    
    if (!_m0.keyEvents) {

        _m0.keyEvents = {};
        /*
            // override jquery's remove function to turn on all key handlers after removal of a form
        const rmOrig = $.fn.remove;
        $.fn.remove = function (){

            $(this)
            .has ('form')
            .each (function () {
                P.allKeysOn ();
            });

            rmOrig.apply (this, arguments);
        }
        */

    } // end if (!_m0.keyEvents)

    const keyEvents = _m0.keyEvents;
    keyEvents [v.jqSelector] = {on: P.setKeyOn, off: P.setKeyOff};
    

}; // end A.init

const cb = {};

//---------------------
cb.cKeyDown = (event) => {
    // callback is v.keyDownHndler
    // returns ch object reflecting which shift keys were pressed down, ch and which values
    //
    // v.reportShift true => trigger callback for each keydown event of any key, 
    //                       including any shift key
    //     false => shift key event reported only when the next non-shift keydown event.
    //              So, callback is only triggered for non-shift key events
    
    //console.log ('go-key.cKeyDown jqSelector: ' + v.jqSelector);

    const which = event.which;

        // never ignore 'Esc' key == 27
    if (v.kIgnore && which != 27) {

        return;

    } // end if (kIgnore)
    
    if (!allowPropagation) {

        event.preventDefault();
        event.stopPropagation ();

    } // end if (!allowPropagation)

    let isAShiftKey = true;
    switch (which) {

        case 16: 
            v.kShift = true;
            break;

        case 17: 
            v.kCtrl = true;
            break;

        case 18: 
            v.kAlt = true;
            break;

        case 91: 
        case 92: 
        case 93: 
        case 224:
            v.kCmd = true;
            break;

        default:
            isAShiftKey = false;
            break;

    }   

    f.cKeyUpDownFinish (isAShiftKey, which, v.keyDownHandler);

    /*
    if (!isAShiftKey) {

        v.kShift = false;
        v.kCtrl = false;
        v.kAlt = false;
        v.kCmd = false;

    } // end if (!isAShiftKey)
    */
    

}; // end cb.cKeyDown 


//---------------------
cb.cKeyUp = (event) => {
    // callback is v.keyDownHndler
    
    const which = event.which;

        // never ignore 'Esc' key == 27
    if (v.kIgnore && which != 27) {

        return;

    } // end if (kIgnore)
    
    event.preventDefault();
    event.stopPropagation ();

    let isAShiftKey = true;
    switch (which) {

        case 16: 
            v.kShift = false;
            break;
        case 17: 
            v.kCtrl = false;
            break;
        case 18: 
            v.kAlt = false;
            break;
        case 91: 
        case 92: 
        case 93: 
        case 224: 
            v.kCmd = false;
            break;

        default:
            isAShiftKey = false;
            break;

    }   

    if (!v.reportUp) {

        return;

    } // end if (!reportUp)
    
    f.cKeyUpDownFinish (isAShiftKey, which, v.keyUpHandler);

}; // end cb.cKeyUp 

const f = {};
//---------------------
f.cKeyUpDownFinish = (isAShiftKey, which, callback) => {
    
    if (isAShiftKey && !v.reportShift) {

        return;

    } // end if (isAShiftKey && !v.reportShift)
    
    const thisCh = f.getKeyCode (which);

    const chOb = ({
        shift: v.kShift,
        ctrl: v.kCtrl,
        alt: v.kAlt,
        macCmd: v.kCmd,
        which: which,
        ch: thisCh,
        isAShiftKey: isAShiftKey,
    });

    // console.log ('chOb: ' + JSON.stringify (chOb) + '\n');
    /*
    if (v.reportShift) {

        chOb.isAShiftKey = isAShiftKey;  
            // true if any of: shift, ctrl, alt, or macCmd are true
            // only relevant if v.reportShift is true

    } // end if (v.reportShift)
    */

    callback (chOb);

}; // end f.cKeyUpDownFinish 


//---------------------
f.defaultHandler = (chOb) => {
    
    const chObS = JSON.stringify (chOb);
    console.log ('go-key.defaultHandler.chOb: ' + chObS);

}; // end f.defaultHandler 



//---------------------
f.getKeyCode = (which) => {
    

    let ch;

    if (v.ctrlOrNonAscii.hasOwnProperty (which)) {

        ch = v.ctrlOrNonAscii [which];

    } else if (v.kShift && v.asciiShifted.hasOwnProperty (which)) {

        ch = v.asciiShifted [which];

    } else if (!v.kShift && v.asciiUnShifted.hasOwnProperty (which)) {

        ch = v.asciiUnShifted [which];

    } else {

        ch = null;

    } // end if 

    return ch;

}; // end f.getKeyCode 



//---------------------
f.initKeyDown = (jqSelector) => {
    
    $(jqSelector)
    .off('keydown')
    .keydown (function (event) {
        //console.log (' ==> initKeyDown');
        cb.cKeyDown (event);
    });

}; // end f.initKeyDown 


//---------------------
f.initKeyUp = (jqSelector) => {
    
    $(jqSelector)
    .off('keyup')
    .keyup (function (event) {
        //console.log (' ==> initKeyUp');
        cb.cKeyUp (event);
    });

}; // end f.initKeyUp 



// PUBLIC Properties/Methods
const P = {};

//---------------------
P.allKeysOff = () => {
    
    const keyEvents = _m0.keyEvents;
    const keySels = Object.keys (keyEvents);

    keySels.forEach (function (el) {

        keyEvents [el].off ();
    });

}; // end P.allKeysOff


//---------------------
P.allKeysOn = () => {
    
    const keyEvents = _m0.keyEvents;
    const keySels = Object.keys (keyEvents);

    keySels.forEach (function (el) {

        keyEvents [el].on ();
    });

}; // end P.allKeysOn


//---------------------
P.setKeyOff = () => {
        // $('body').prepend (`setKeyOff...`);
    
        //console.log ('SETKEYOFF go-key.setKeyOff     jqSelector = ' + v.jqSelector);
    $(v.jqSelector)
    .off ('keydown')
    .off ('keyup');

}; // end P.setKeyOff


//---------------------
//P.setKeyOn = (jqSel) => {
P.setKeyOn = () => {
        // $('body').prepend (`setKeyOn...`);
    
        //console.log ('SETKEYON go-key.setKeyOn   jqSelector = ' + v.jqSelector);
    //f.initKeyUp (jqSel);
    //f.initKeyDown (jqSel);
    f.initKeyUp (v.jqSelector);
    f.initKeyDown (v.jqSelector);

}; // end P.setKeyHandler

// end PUBLIC section

A.init ();

return P;

};

},{}],4:[function(require,module,exports){
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



},{"go-json2html":2,"go-key":3}],5:[function(require,module,exports){
// go-msg/index.js
// go-msg object has a unique primary msg and zero or more optional attributes


module.exports = function (p0) {

const v = {

    primary: null,
        // primary: {cmd: 1} (contains optional content) or {cmd: 0} (no optional content allowed)

    secondary: null,
        // if a primary message has an optional attribute that concidentally is the same as
        // another primary message, it should be have a key/value pair in secondary {attr: 1}
        // to ensure that it will be treated as an attribute in case a primary is present
        // Secondary is only tested if there exists a primary key

    meta: null,
        // meta parameters intended for ctrl or other purpose outside of primary and secondary msg
        // parameter usage

};  

const A = {};
//---------------------
A.init = () => {

    v.primary = p0.primary;
    v.secondary = p0.hasOwnProperty ('secondary') ? p0.secondary : {};
    v.meta = p0.hasOwnProperty ('meta') ? p0.meta : {};

}; // end A.init


const f = {};

//---------------------
f.parseMsg = (msgOb) => {
    
    const res = {};
    const msgKeys = Object.keys (msgOb);

    const primaryCandidatesOb = {};
    const attrsOb = {};
    const metaOb = {};

    let key;
    for (let i = 0; i < msgKeys.length; i++) {

        key = msgKeys [i];
        
        if (v.primary.hasOwnProperty (key)) {

            primaryCandidatesOb [key] = 1;

        } else if (v.meta.hasOwnProperty (key)) {

            metaOb [key] = msgOb [key];

        } else {

            attrsOb [key] = msgOb [key];

        } // end if (v.primary.hasOwnProperty (key))
        
    } // end for (let i = 0; i < msgKeys.length; i++)

    const primaryCandidatesA = Object.keys (primaryCandidatesOb);

    let primaryKey = null;

    if (primaryCandidatesA.length === 1) {

        primaryKey = primaryCandidatesA [0];

    } else {
        // handle primary/secondary key resolution

        for (key in primaryCandidatesOb) {

            if (v.secondary.hasOwnProperty (key)) {

                attrsOb [key] = msgOb [key];

            } else {

                if (primaryKey === null) {

                    primaryKey = key;

                } else {

                    res.err = 'Multiple primary keys found: ' + primaryKey + ',' + key + 'and possibly others. Original message\n'  + JSON.stringify (msgOb);

                } // end if (primaryKey === null)
                

            } // end if (v.secondary.hasOwnProperty (key))
            
        }

    } // end if (primaryCandidatesA.length === 0)

    if (primaryKey === null) {

        res.err = 'go-msg.parseMsg: Either there was no primary key or multiple primary candidates are members of secondary: ' + JSON.stringify (primaryCandidatesA);

    } // end if (primaryKey === null)
    


    res.p = primaryKey;
    res.c = primaryKey && v.primary [primaryKey] !== 0 ? msgOb [primaryKey] : null;
        // example void html tag has zero content, so content is forced to null

    res.s = attrsOb;
    res.m = metaOb;

    return res;

}; // end f.parseMsg 



const P = {};

//---------------------
P.parseMsg = (msgOb) => {
    
    const res = f.parseMsg (msgOb);

    action = v.primary [res.p];
    if (typeof action === 'function') {

        action (res);

    } // end if (typeof action === 'function')
        

    return res;

}; // end P.parseMsg 


//---------------------
P.primaryKeyGet = (msgOb) => {
    
    const res = f.parseMsg (msgOb);
    return res.p;

}; // end P.primaryKeyGet 


A.init ();

return P;

};




},{}],6:[function(require,module,exports){

// rmTab.js (go-x2)

// inserts an 'X' into upper right 
// corner of parent in order to remove parent when clicked

module.exports = function (p0) {

const v = {
    jqSel: p0.jqSel,
    dpp: p0.dpp,
    deleteCb: p0.deleteCb ? p0.deleteCb : null,
    showX: p0.showX ? p0.showX : null,

    IdX: null,
};

const A={};

A.init = () => {

        // v.dpp ({text: 'INITXAutoTS...', prepend: 'body'});
    const visibility = v.showX ? 'visible' : 'hidden';

        // ----  clicked ----
    const clicked = function () {

        if (v.deleteCb === null) {

            $(v.jqSel)
            .remove ();

        } else {

            v.deleteCb (v.jqSel);

        } // end if (v.deleteCb === null)
        
    };  // end clicked


    const X = {
        span: 'X',
        parent: v.jqSel,
        style: `
            position: absolute; 
            top: -3px; 
            right: -3px;
            visibility: ${visibility};`,
        hin: function (Id) {

            $(Id).css ({cursor: 'cell'});
        },
        clk: function (Id) {

            clicked ();
            return false;
                // same as preventDefault and stopPropagation,
                // but will not stop immediate propagation (other
                // click handlers on the same element)
        },
    };

    v.IdX = v.dpp (X);

        // for mobile devices: apparently clicks on 
        // absolutely positioned elements aren't recognized.
    $(v.IdX)
    .on ('touchend', function () {
        
        clicked ();
        return false;
    });

    const curPos = $(v.jqSel).css ('position');
    if (curPos !== 'absolute') {

        $(v.jqSel)
        .css ({
            position: 'relative',
        });

    } // end if (curPos !== 'absolute')
    
    const selEvts = {
        sel: v.jqSel,
        hin: function () {
            $(v.IdX)
            .css ({visibility: 'visible'});
        },
        hot: function () {
            $(v.IdX)
            .css ({visibility: 'hidden'});
        },
//        dclk: function () {
//            // for the benefit of mobile users having no hover fn
//    
//            const vStat = $(v.IdX).css ('visibility');
//            const newStat = vStat === 'visible' ? 'hidden' : 'visible';
//    
//            $(v.IdX)
//            .css ({visibility: newStat});
//        },
    };

    v.dpp (selEvts);

};  // end A.init

const P = {};

//---------------------
P.xRm = () => {
    
    $(v.IdX).remove ();

}; // end P.xRm




A.init ();

return P;

};




},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlc19nbG9iYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9kYmwtY2xpY2svaW5kZXguanMiLCIuLi9nby1qMmgvaW5kZXguanMiLCJpbmRleC5qcyIsImtleVRlc3QuanMiLCIuLi9nby1tc2cvaW5kZXguanMiLCIuLi9nby14Mi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeG9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2poQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gZGJsLWNsaWNrL2luZGV4LmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHAwKSB7XG5cbmNvbnN0IHYgPSB7XG5cbiAgICBzZWw6IHAwLnNlbCxcbiAgICBzaW5nbGVDYjogcDAuc2luZ2xlQ2IsXG4gICAgZG91YmxlQ2I6IHAwLmRvdWJsZUNiLFxuICAgIERFTEFZOiBwMC5kZWxheSA/IHAwLmRlbGF5IDogMzAwLFxuICAgIHRpbWVyOiBudWxsLFxuXG59O1xuXG5jb25zdCBBID0ge307XG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkEuaW5pdCA9ICgpID0+IHtcblxuICAgICAgICAvLyBzb2x1dGlvbjogdXNlIHRpbWVyIHRvIHByZXZlbnQgc2luZ2xlIGNsaWNrIGZyb20gZmlyaW5nIHdoZW4gZG91YmxlIGNsaWNrIGZpcmVzXG4gICAgICAgIC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvamF2YXNjcmlwdC9iaW5kLWRpZmZlcmVudC1ldmVudHMtdG8tY2xpY2stYW5kLWRvdWJsZS1jbGljay9cblxuICAgIGNvbnN0IHNlbCA9ICQodi5zZWwpO1xuXG4gICAgY29uc3QgaXNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcbiAgICBpZiAoaXNUb3VjaCkge1xuXG4gICAgICAgIHNlbC5vbiAoJ3RvdWNoZW5kJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgZi5kb0Nsa1RvdWNoRXZlbnQgKGV2dCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBzZWwuY2xpY2sgKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGYuZG9DbGtUb3VjaEV2ZW50IChldnQpO1xuICAgICAgICB9KTtcblxuICAgIH0gLy8gZW5kIGlmIChpc1RvdWNoKVxuICAgIFxuXG59OyAvLyBlbmQgQS5pbml0XG5cbmNvbnN0IGYgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYuZG9DbGtUb3VjaEV2ZW50ID0gKGV2dCkgPT4ge1xuICAgIFxuICAgIGNvbnN0IElkID0gJyMnICsgZXZ0LnRhcmdldC5pZDtcblxuICAgICQoJyonKVxuICAgIC5ibHVyICgpO1xuICAgICAgICAvLyByZW1vdmVzIGV2aWwgYmx1ZSBib3JkZXJcblxuICAgIGlmICh2LnRpbWVyKSB7XG5cbiAgICAgICAgICAgIC8vICQoJ2JvZHknKS5wcmVwZW5kIChgZENsay5EYmwuSWQ9JHtJZH0uLi5gKTtcbiAgICAgICAgY2xlYXJUaW1lb3V0ICh2LnRpbWVyKTtcbiAgICAgICAgdi50aW1lciA9IG51bGw7XG4gICAgICAgIHJldHVybiB2LmRvdWJsZUNiIChJZCk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHYudGltZXIgPSBzZXRUaW1lb3V0IChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAvLyAkKCdib2R5JykucHJlcGVuZCAoYGRDbGsuU2dsLklkPSR7SWR9Li4uYCk7XG4gICAgICAgICAgICB2LnRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh2LnNpbmdsZUNiICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdi5zaW5nbGVDYiAoSWQpO1xuXG4gICAgICAgICAgICB9IC8vIGVuZCBpZiAodi5zaW5nbGVDYiAhPT0gbnVsbClcbiAgICAgICAgICAgIFxuICAgICAgICB9LCB2LkRFTEFZKTtcblxuICAgIH0gLy8gZW5kIGlmIChjbGlja2VkKVxuXG59OyAvLyBlbmQgZi5kb0Nsa1RvdWNoRXZlbnQgXG5cblxuQS5pbml0ICgpO1xuXG59O1xuXG5cblxuIiwiLy8gZ28tajJoL2luZGV4LmpzXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcblxuLy8gUFJJVkFURSBQcm9wZXJ0aWVzL01ldGhvZHNcbmNvbnN0IHYgPSB7XG5cbiAgICBpZDogMCxcbiAgICBwcmltaXRpdmVUeXBlc05vdE51bGw6IHsnc3RyaW5nJzoxLCAnbnVtYmVyJzoxLCAnYm9vbGVhbic6MSwgJ3N5bWJvbCc6IDF9LFxuICAgICAgICAvLyBzaW5jZSB0eXBlb2YgbnVsbCB5aWVsZHMgJ29iamVjdCcsIGl0J3MgaGFuZGxlZCBzZXBhcmF0ZWx5XG5cbiAgICBtc2dUeXBlczoge1xuXG4gICAgICAgIHByaW1hcnk6IHtcbiAgICAgICAgICAgICAgICAvLyB2b2lkIHRhZ3NcbiAgICAgICAgICAgIGFyZWE6IDAsIGJhc2U6IDAsIGJyOiAwLCBjb2w6IDAsIGVtYmVkOiAwLCBocjogMCwgaW1nOiAwLCBpbnB1dDogMCwga2V5Z2VuOiAwLCBsaW5rOiAwLCBtZXRhOiAwLCBwYXJhbTogMCwgc291cmNlOiAwLCB0cmFjazogMCwgd2JyOiAwLCBcblxuICAgICAgICAgICAgICAgIC8vIG5vbi12b2lkIHRhZ3NcbiAgICAgICAgICAgIGE6IDEsIGFiYnI6IDEsIGFkZHJlc3M6IDEsIGFydGljbGU6IDEsIGFzaWRlOiAxLCBhdWRpbzogMSwgYjogMSwgYmRpOiAxLCBiZG86IDEsIGJsb2NrcXVvdGU6IDEsIGJvZHk6IDEsIGJ1dHRvbjogMSwgY2FudmFzOiAxLCBjYXB0aW9uOiAxLCBjaXRlOiAxLCBjb2RlOiAxLCBjb2xncm91cDogMSwgZGF0YWxpc3Q6IDEsIGRkOiAxLCBkZWw6IDEsIGRldGFpbHM6IDEsIGRmbjogMSwgZGlhbG9nOiAxLCBkaXY6IDEsIGRsOiAxLCBkdDogMSwgZW06IDEsIGZpZWxkc2V0OiAxLCBmaWdjYXB0aW9uOiAxLCBmaWd1cmU6IDEsIGZvb3RlcjogMSwgZm9ybTogMSwgaDE6IDEsIGgyOiAxLCBoMzogMSwgaDQ6IDEsIGg1OiAxLCBoNjogMSwgaGVhZDogMSwgaGVhZGVyOiAxLCBoZ3JvdXA6IDEsIGh0bWw6IDEsIGk6IDEsIGlmcmFtZTogMSwgaW5zOiAxLCBrYmQ6IDEsIGxhYmVsOiAxLCBsZWdlbmQ6IDEsIGxpOiAxLCBtYXA6IDEsIG1hcms6IDEsIG1lbnU6IDEsIG1ldGVyOiAxLCBuYXY6IDEsIG5vc2NyaXB0OiAxLCBvYmplY3Q6IDEsIG9sOiAxLCBvcHRncm91cDogMSwgb3B0aW9uOiAxLCBvdXRwdXQ6IDEsIHA6IDEsIHByZTogMSwgcHJvZ3Jlc3M6IDEsIHE6IDEsIHJwOiAxLCBydDogMSwgcnVieTogMSwgczogMSwgc2FtcDogMSwgc2NyaXB0OiAxLCBzZWN0aW9uOiAxLCBzZWxlY3Q6IDEsIHNtYWxsOiAxLCBzcGFuOiAxLCBzdHJvbmc6IDEsIHN0eWxlOiAxLCBzdWI6IDEsIHN1bW1hcnk6IDEsIHN1cDogMSwgc3ZnOiAxLCB0YWJsZTogMSwgdGJvZHk6IDEsIHRkOiAxLCB0ZXh0YXJlYTogMSwgdGZvb3Q6IDEsIHRoOiAxLCB0aGVhZDogMSwgdGltZTogMSwgdGl0bGU6IDEsIHRyOiAxLCB1OiAxLCB1bDogMSwgJ3Zhcic6IDEsIHZpZGVvOiAxLFxuICAgICAgICB9LFxuXG4gICAgICAgIHNlY29uZGFyeToge3N0eWxlOiAxfSxcbiAgICAgICAgICAgIC8vIGVsZW1lbnRzIHRoYXQgY2FuIGJlIGVpdGhlciBhIHByaW1hcnkgdGFnIGl0c2VsZiBvciBhbiBhdHRyaWJ1dGUgb2YgYW5vdGhlciBwcmltYXJ5IHRhZ1xuICAgICAgICAgICAgLy8gaWYgYW55IG90aGVyIHByaW1hcnkgdGFncyBpcyBwcmVzZW50LCB0aGVuIHNlY29uZGFyeSB0YWdzIGFyZSB0cmVhdGVkIGFzXG4gICAgICAgICAgICAvLyBhdHRyaWJ1dGVzIG9mIHRoZSBvdGhlciBwcmltYXJ5IHRhZ1xuXG4gICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgIHNlbDogMSxcbiAgICAgICAgICAgICAgICAvLyBzZWwgPT4gYWRkIGV2ZW50cyB0byBleGlzdGluZyBzZWxlY3RvclxuICAgICAgICAgICAgICAgIC8vIHByZXN1bWVzIHRoZXJlIGlzIG5vIHByaW1hcnkga2V5IChlbHNlIHdvdWxkXG4gICAgICAgICAgICAgICAgLy8gYmUgYWRkaW5nIGEgbmV3IGVsZW1lbnQsIG5vdCBtb2RpZnlpbmcgZXhpc3RpbmcpXG4gICAgICAgICAgICBlbXB0eTogMSwgcm06IDEsIFxuICAgICAgICAgICAgcHJlcGVuZDogMSwgYXBwZW5kOiAxLCBiZWZvcmU6IDEsIGFmdGVyOiAxLCBwYXJlbnQ6IDEsXG4gICAgICAgICAgICBhdHRyOiAxLCBjb250ZW50OiAxLCB0ZXh0OiAxLCBcbiAgICAgICAgICAgIGNsazogMSwgZGNsazogMSwgaGluOiAxLCBob3Q6IDEsIHNidDoxLCBnb3g6IDEsXG4gICAgICAgICAgICAgICAgLy8gZGVmaW5lIGNsaWNrLCBkb3VibGUtY2xpY2ssIGhvdmVySW4sIGhvdmVyT3V0IGFuZCBzdWJtaXQgY2FsbGJhY2tzXG4gICAgICAgICAgICBldnQ6MSxcbiAgICAgICAgICAgICAgICAvLyBsb2NhbCBldnQgY3RybCA9PiBvdmVycmlkZXMgdi5ldnRJc09uIHN0YXR1c1xuICAgICAgICB9LFxuXG4gICAgfSxcblxuICAgIGRibENsaWNrOiByZXF1aXJlICgnZGJsLWNsaWNrJyksXG4gICAgZ29YMDogcmVxdWlyZSAoJ2dvLXgyJyksXG4gICAgZGJsQ2xpY2tEZWxheTogNzAwLFxuXG4gICAgbXNnMDogcmVxdWlyZSAoJ2dvLW1zZycpLFxuICAgIG1zZzogbnVsbCxcblxuICAgIGV2dElzT246IHRydWUsXG4gICAgaXNUb3VjaDogZmFsc2UsXG5cbn07IC8vIGVuZCBQUklWQVRFIHByb3BlcnRpZXNcbmNvbnN0IEE9e307XG5jb25zdCBmPXt9O1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQS5pbml0ID0gKCkgPT4ge1xuICAgIFxuICAgIHYubXNnID0gbmV3IHYubXNnMCAodi5tc2dUeXBlcyk7XG5cbiAgICB2LmlzVG91Y2ggPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3c7XG5cbn07IC8vIGVuZCBBLmluaXRcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5hdHRyID0gKHNlbGVjdG9yLCBhdHRyKSA9PiB7XG4gICAgXG4gICAgJChzZWxlY3RvcilcbiAgICAuYXR0ciAoYXR0cik7XG5cbn07IC8vIGVuZCBmLmF0dHIgXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYuZW1wdHkgPSAoc2VsZWN0b3IpID0+IHtcbiAgICBcbiAgICAkKHNlbGVjdG9yKVxuICAgIC5lbXB0eSAoKVxuICAgIC5vZmYgKCdrZXlkb3duJyk7XG5cbn07IC8vIGVuZCBmLmVtcHR5IFxuXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYucm0gPSAoc2VsZWN0b3IpID0+IHtcblxuICAgICQoc2VsZWN0b3IpXG4gICAgLnJlbW92ZSAoKTtcblxufTsgLy8gZW5kIGYucm1cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5kaXNwbGF5T2JIID0gKHBhcmVudCwgZGlzcE9iKSA9PiB7XG4gICAgXG4gICAgICAgIC8vIC0tLS0gIGRvQXJyYXkgLS0tLVxuICAgIGNvbnN0IGRvQXJyYXkgPSBmdW5jdGlvbiAoZGlzcE9iKSB7XG5cbiAgICAgICAgY29uc3QgSWRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlzcE9iLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIElkcy5wdXNoIChmLmRpc3BsYXlPYkggKHBhcmVudCwgZGlzcE9iIFtpXSkpO1xuXG4gICAgICAgIH0gLy8gZW5kIGZvciAobGV0IGkgPSAwOyBpIDwgZGlzcE9iLmxlbmd0aDsgaSsrKVxuXG4gICAgICAgIHJldHVybiBJZHMgW0lkcy5sZW5ndGggLSAxXTtcbiAgICAgICAgLy9yZXR1cm4gSWRzO1xuICAgICAgICBcbiAgICB9OyAgLy8gZW5kIGRvQXJyYXkgXG5cbiAgICAgICAgLy8gLS0tLSAgZG9PYmplY3QgLS0tLVxuICAgIGNvbnN0IGRvT2JqZWN0ID0gZnVuY3Rpb24gKGRpc3BPYikge1xuXG4gICAgICAgIGNvbnN0IGRpc3BPYlBhcnNlZCA9IHYubXNnLnBhcnNlTXNnIChkaXNwT2IpO1xuXG4gICAgICAgIGNvbnN0IHByaW1hcnlLZXkgPSBkaXNwT2JQYXJzZWQucDtcblxuICAgICAgICBjb25zdCBtZXRhID0gZGlzcE9iUGFyc2VkLm07XG5cbiAgICAgICAgbGV0IHJlbExvYyA9ICdhcHBlbmQnO1xuXG4gICAgICAgIGxldCBbc2VsLCBkZWxLZXksIGF0dHIsIGNvbnRlbnQsIHRleHQsIGNsaywgZGNsaywgaGluLCBob3QsIHNidCwgZ294XSA9IG5ldyBBcnJheSAoMTEpLmZpbGwgKG51bGwpO1xuXG5cbiAgICAgICAgaWYgKG1ldGEuaGFzT3duUHJvcGVydHkgKCdwYXJlbnQnKSkge1xuICAgICAgICAgICAgLy8gZW5zdXJlcyBwcm9jZXNzaW5nIG9mICdwYXJlbnQnIGJlZm9yZSByZW1haW5kZXIgb2YgbWV0YSBrZXlzXG5cbiAgICAgICAgICAgIHBhcmVudCA9IG1ldGEucGFyZW50O1xuICAgICAgICAgICAgZGVsZXRlIG1ldGEucGFyZW50O1xuXG4gICAgICAgIH0gLy8gZW5kIGlmIChtZXRhLmhhc093blByb3BlcnR5ICgncGFyZW50JykpXG4gICAgICAgIFxuICAgICAgICBsZXQgZXZ0SXNPbiA9IHYuZXZ0SXNPbjtcblxuICAgICAgICBjb25zdCBtZXRhS2V5cyA9IE9iamVjdC5rZXlzIChtZXRhKTtcbiAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgbWV0YUtleXMubGVuZ3RoOyBpZHgrKykge1xuXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBtZXRhS2V5cyBbaWR4XTtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdzZWwnOlxuICAgICAgICAgICAgICAgICAgICBzZWwgPSBtZXRhLnNlbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgICAgICAgICAgY2FzZSAncm0nOlxuICAgICAgICAgICAgICAgICAgICBkZWxLZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IG1ldGEgW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnYXR0cic6XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgPSBtZXRhLmF0dHI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGVudCc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBtZXRhLmNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gbWV0YS50ZXh0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3ByZXBlbmQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2FwcGVuZCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnYmVmb3JlJzpcbiAgICAgICAgICAgICAgICBjYXNlICdhZnRlcic6XG4gICAgICAgICAgICAgICAgICAgIHJlbExvYyA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gbWV0YSBba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9QYXJlbnQgPSB2YWwgIT09IDEgJiYgdmFsICE9PSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBkb1BhcmVudCA/IHZhbCA6IHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHZhbCBpcyBvdGhlciB0aGFuIDEgb3IgdHJ1ZSwgcmVsTG9jIG92ZXJyaWRlcyBib3RoIHBhcmVudCB2YWx1ZXMgcGFzc2VkIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW50byBkaXNwbGF5T2JIIGFuZCBkZWZpbmVkIGJ5IG9wdGlvbmFsIHBhcmVudCBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjbGsnOlxuICAgICAgICAgICAgICAgICAgICBjbGsgPSBmdW5jdGlvbiAoSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZCBPbmx5IHZhbGlkIGlmIGluIGRjbGsgY29udGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgSWQgPSB0eXBlb2YgSWQgPT09ICdzdHJpbmcnID8gSWQgOiAnIycgKyBJZC50YXJnZXQuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKElkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmJsdXIgKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0YS5jbGsgKElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2RjbGsnOlxuICAgICAgICAgICAgICAgICAgICBkY2xrID0gZnVuY3Rpb24gKElkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKElkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmJsdXIgKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0YS5kY2xrIChJZCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaGluJzpcbiAgICAgICAgICAgICAgICAgICAgaGluID0gZnVuY3Rpb24gKElkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0YS5oaW4gKElkKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdob3QnOlxuICAgICAgICAgICAgICAgICAgICBob3QgPSBmdW5jdGlvbiAoSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRhLmhvdCAoSWQpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3NidCc6XG4gICAgICAgICAgICAgICAgICAgIHNidCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1GaWVsZHMgPSAkKHRoaXMpLnNlcmlhbGl6ZSAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGEuc2J0IChmb3JtRmllbGRzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvciBmb3JtcywgYWx3YXlzIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2V2dCc6XG4gICAgICAgICAgICAgICAgICAgIGV2dElzT24gPSBtZXRhLmV2dDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdnb3gnOlxuICAgICAgICAgICAgICAgICAgICBnb3ggPSBtZXRhLmdveDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdveCB2YWx1ZSBpcyBkZWxldGVDYiBmdW5jdGlvbiB0aGF0IGdldHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGxlZCB3aGVuIFggaXMgY2xpY2tlZFxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gLy8gZW5kIHN3aXRjaCAoa2V5KVxuICAgICAgICAgICAgXG5cbiAgICAgICAgfSAvLyBlbmQgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgbWV0YUtleXMubGVuZ3RoOyBpZHgrKylcbiAgICAgICAgXG5cbiAgICAgICAgSWQgPSBudWxsO1xuXG4gICAgICAgIGlmIChkZWxLZXkpIHtcblxuICAgICAgICAgICAgZiBbZGVsS2V5XSAocGFyZW50KTtcblxuICAgICAgICB9IGVsc2UgaWYgKGF0dHIpIHtcblxuICAgICAgICAgICAgZi5hdHRyIChwYXJlbnQsIGF0dHIpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGVudCkge1xuICAgICAgICAgICAgLy8gcmVwbGFjZXMgZW50aXJlIGNvbnRlbnQgb2YgcGFyZW50IHdpdGggbmV3IGNvbnRlbnRcblxuICAgICAgICAgICAgJChwYXJlbnQpXG4gICAgICAgICAgICAuZW1wdHkgKCk7XG5cbiAgICAgICAgICAgIGYuZGlzcGxheU9iSCAocGFyZW50LCBjb250ZW50KTtcbiAgICAgICAgICAgICAgICAvLyB3aXRob3V0IGVtcHR5aW5nIGZpcnN0LCB3aWxsIHNpbXBseSBhcHBlbmQgY29udGVudCB0byBleGlzdGluZyBjb250ZW50XG5cbiAgICAgICAgfSBlbHNlIGlmICh0ZXh0KSB7XG5cbiAgICAgICAgICAgIElkID0gZi50ZXh0TWFrZSAocGFyZW50LCByZWxMb2MsIHRleHQpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmIChzZWwpIHtcblxuICAgICAgICAgICAgICAgIElkID0gc2VsO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgSWQgPSBmLmVsZW1lbnRNYWtlIChwYXJlbnQsIHJlbExvYywgcHJpbWFyeUtleSwgZGlzcE9iUGFyc2VkLmMsIGRpc3BPYlBhcnNlZC5zKTtcblxuICAgICAgICAgICAgfSAvLyBlbmQgaWYgKHNlbClcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpZiAoZXZ0SXNPbikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGRjbGspIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG5ldyB2LmRibENsaWNrICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWw6IElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlQ2I6IGNsayA/IGNsayA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3VibGVDYjogZGNsayxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5OiB2LmRibENsaWNrRGVsYXksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjbGspIHtcbiAgICBcbi8vICAgICAgICAgICAgICAgICAgICAkKElkKVxuLy8gICAgICAgICAgICAgICAgICAgIC5jbGljayAoY2xrKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xrSWQgPSAkKElkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYuaXNUb3VjaCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGtJZC5vbiAoJ3RvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjbGsgKElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsa0lkLmNsaWNrIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsayAoSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgKHYuaXNUb3VjaClcbiAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgJChJZClcbi8vICAgICAgICAgICAgICAgICAgICAuY2xpY2sgKGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsayAoSWQpO1xuLy8gICAgICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgICAgICAgICAgLm9uICgndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHtcbi8vUC5kaXNwbGF5T2IgKHt0ZXh0OiAndG91Y2hzdGFydC4uLicsIHByZXBlbmQ6ICdib2R5J30pO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBjbGsgKElkKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuLy8gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmIChjbGspXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKGhpbikge1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAkKElkKVxuICAgICAgICAgICAgICAgICAgICAubW91c2VlbnRlciAoZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgSWQgPSAnIycgKyBldnQudGFyZ2V0LmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpbiAoSWQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiAoaGluKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChob3QpIHtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgJChJZClcbiAgICAgICAgICAgICAgICAgICAgLm1vdXNlbGVhdmUgKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IElkID0gJyMnICsgZXZ0LnRhcmdldC5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBob3QgKElkKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgKGhpbilcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoc2J0KSB7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICQoSWQpXG4gICAgICAgICAgICAgICAgICAgIC5zdWJtaXQgKHNidCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAndGhpcycgaXMgdG90YWxseSBkaWZmZXJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbXBhcmVkIHRvICd0aGlzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2l0aCB0aGlzIGNvbnN0cnVjdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vLnN1Ym1pdCAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc2J0ICgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy99KTtcbiAgICBcbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiAoaGluKVxuXG4gICAgICAgICAgICAgICAgaWYgKGdveCkge1xuXG4gICAgICAgICAgICAgICAgICAgIG5ldyB2LmdvWDAgKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpxU2VsOiBJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRwcDogUC5kaXNwbGF5T2JBLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlQ2I6IHR5cGVvZiBnb3ggPT09ICdmdW5jdGlvbicgPyBnb3ggOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmIChnb3gpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIH0gLy8gZW5kIGlmIChldnRJc09uKVxuICAgICAgICAgICAgXG4gICAgICAgIH0gLy8gZW5kIGlmIChkZWxLZXkpXG5cbiAgICAgICAgcmV0dXJuIElkO1xuICAgICAgICBcbiAgICB9OyAgLy8gZW5kIGRvT2JqZWN0IFxuXG5cblxuICAgICAgIC8vIC0tLS0gbWFpbiAtLS0tXG4gICAgbGV0IElkO1xuICAgIGNvbnN0IGRpc3BPYlR5cGUgPSB0eXBlb2YgZGlzcE9iO1xuXG4gICAgaWYgKGRpc3BPYlR5cGUgPT09ICd1bmRlZmluZWQnIHx8IGRpc3BPYiA9PT0gMCB8fCBkaXNwT2IgPT09IG51bGwpIHtcblxuICAgICAgICBJZCA9IG51bGw7XG5cbiAgICB9IGVsc2UgaWYgKHYucHJpbWl0aXZlVHlwZXNOb3ROdWxsLmhhc093blByb3BlcnR5IChkaXNwT2JUeXBlKSkge1xuXG4gICAgICAgIElkID0gZi50ZXh0TWFrZSAocGFyZW50LCAnYXBwZW5kJywgZGlzcE9iKTtcbiAgICAgICAgICAgIC8vIGlmIHRleHQgc2hvdWxkIGJlIHBsYWNlZCBhdCBvdGhlciB0aGFuICdhcHBlbmQnIGxvY2F0aW9uLCB0aGVuIHVzZVxuICAgICAgICAgICAgLy8gJ3RleHQnIHRhZyBhbmQgc3BlY2lmeSBwcmVwZW5kLCBhZnRlciBvciBiZWZvcmUgYXMgbmVlZGVkXG5cbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkgKGRpc3BPYikpIHtcblxuICAgICAgICBJZCA9IGRvQXJyYXkgKGRpc3BPYik7XG5cbiAgICB9IGVsc2UgaWYgKGRpc3BPYlR5cGUgPT0gJ29iamVjdCcpIHtcblxuICAgICAgICBJZCA9IGRvT2JqZWN0IChkaXNwT2IpO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBJZCA9IG51bGw7XG5cbiAgICB9IC8vIGVuZCBpZiAodHlwZW9mIGRpc3BPYiA9PT0gJ3VuZGVmaW5lZCcgfHwgZGlzcE9iID09PSAwIHx8IGRpc3BPYiA9PT0gbnVsbClcbiAgICBcbiAgICByZXR1cm4gSWQ7XG5cbn07IC8vIGVuZCBmLmRpc3BsYXlPYkggXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmVsZW1lbnRNYWtlID0gKHBhcmVudE9yU2libElkLCByZWxMb2MsIGVsTmFtZSwgY29udGVudCwgYXR0cnMpID0+IHtcbiAgICBcbiAgICBsZXQgaWQ7XG4gICAgY29uc3QgYXR0cktleXMgPSBPYmplY3Qua2V5cyAoYXR0cnMpO1xuICAgIGNvbnN0IGhhc0F0dHJzID0gYXR0cktleXMubGVuZ3RoID4gMDtcblxuICAgIGlmIChoYXNBdHRycyAmJiBhdHRycy5oYXNPd25Qcm9wZXJ0eSAoJ2lkJykpIHtcblxuICAgICAgICBpZCA9IGF0dHJzLmlkO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBpZCA9IFAuZ2VuSWQgKCk7XG5cbiAgICB9IC8vIGVuZCBpZiAoaGFzQXR0cnMpXG4gICAgXG4gICAgY29uc3QgSWQgPSAnIycgKyBpZDtcbiAgICBcbiAgICBpZiAoZWxOYW1lID09PSAnc2NyaXB0JyAmJiBjb250ZW50ICE9PSAwKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzk0MTM3MzcvaG93LXRvLWFwcGVuZC1zY3JpcHQtc2NyaXB0LWluLWphdmFzY3JpcHRcbiAgICAgICAgLy8gaW5zcGlyZWQgYnkgU08gcXVlc3Rpb24sIGJ1dCBzZXR0aW5nIGlubmVySFRNTCBpc24ndCBzdXBwb3NlZCB0byB3b3JrXG4gICAgICAgIC8vIHRoZXJlZm9yZSwgc2V0IHNyYyBhdHRyaWJ1dGUgd2l0aCBwYXRoIHRvIGZpbGUsIGluc3RlYWQgb2YgXG4gICAgICAgIC8vIHNldHRpbmcgaW5uZXJIVE1MIHRvIGNvbnRlbnQgb2YgZmlsZVxuXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYxMDk5NS9jYW50LWFwcGVuZC1zY3JpcHQtZWxlbWVudFxuICAgICAgICAvLyBqUXVlcnkgd29uJ3QgYWRkIHNjcmlwdCBlbGVtZW50IGFzIGl0IGRvZXMgd2l0aCBhbnkgb3RoZXIgZWxlbWVudC4gIFRoZXJlZm9yZSwgbXVzdCBiZSBkb25lXG4gICAgICAgIC8vIHVzaW5nIG9ubHkgamF2YXNjcmlwdCBhcyBmb2xsb3dzOlxuICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuXG4gICAgICAgIHNjcmlwdC5zcmMgPSBjb250ZW50O1xuICAgICAgICBzY3JpcHQuaWQgPSBhdHRycy5pZDtcbiAgICAgICAgXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTsgICAgIFxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBsZXQgZGl2ZWwgPSAnPCcgKyBlbE5hbWUgKyAnIGlkPVwiJyArIGlkICsgJ1wiJztcbiAgICBcbiAgICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICBcbiAgICAgICAgICAgIGRpdmVsICs9ICc+PC8nICsgZWxOYW1lICsgJz4nO1xuICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgZGl2ZWwgKz0gJz4nO1xuICAgIFxuICAgICAgICB9IC8vIGVuZCBpZiAoY29udGVudClcbiAgICBcbiAgICAgICAgJChwYXJlbnRPclNpYmxJZClbcmVsTG9jXSAoZGl2ZWwpO1xuXG4gICAgfSAvLyBlbmQgaWYgKGVsTmFtZSA9PT0gJ3NjcmlwdCcpXG4gICAgXG4gICAgXG4gICAgaWYgKGhhc0F0dHJzKSB7XG4gICAgICAgIFxuICAgICAgICAkKElkKVxuICAgICAgICAuYXR0ciAoYXR0cnMpO1xuXG4gICAgfSAvLyBlbmQgaWYgKGhhc0F0dHJzKVxuXG4gICAgZi5kaXNwbGF5T2JIIChJZCwgY29udGVudCk7XG4gICAgXG4gICAgaWYgKGVsTmFtZSA9PT0gJ2Zvcm0nKSB7XG5cbiAgICAgICAgJChwYXJlbnQpXG4gICAgICAgIC5mb2N1cyAoKTtcblxuICAgIH0gLy8gZW5kIGlmIChlbE5hbWUgPT09ICdmb3JtJylcbiAgICBcbiAgICByZXR1cm4gSWQ7XG5cbn07IC8vIGVuZCBmLmVsZW1lbnRNYWtlXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYudGV4dE1ha2UgPSAocGFyZW50LCByZWxMb2MsIHByaW1pdGl2ZSkgPT4ge1xuICAgIFxuLy8gICAgY29uc3QgaXNCdWZmZXIgPSB0eXBlb2YgcHJpbWl0aXZlID09PSAnb2JqZWN0JyAmJiBwcmltaXRpdmUudHlwZSA9PT0gJ0J1ZmZlcic7XG4vL1xuLy8gICAgaWYgKGlzQnVmZmVyKSB7XG4vL1xuLy8gICAgICAgIHByaW1pdGl2ZSA9IHByaW1pdGl2ZS5kYXRhLnRvU3RyaW5nICgpO1xuLy9cbi8vICAgIH0gLy8gZW5kIGlmIChpc0J1ZmZlcilcbiAgICBcblxuICAgIGlmICh0eXBlb2YgcHJpbWl0aXZlID09PSAnc3RyaW5nJykge1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgc2luZ2xlcXVvdGUgPSAnJiN4MDAyNzsnO1xuICAgICAgICBjb25zdCBiYWNrc2xhc2ggPSAnJiN4MDA1YzsnO1xuICAgICAgICBjb25zdCBkb3VibGVxdW90ZSA9ICcmI3gwMDIyOyc7XG4gICAgICAgIGNvbnN0IGx0ID0gJyZsdDsnO1xuICAgICAgICBcbiAgICAgICAgcHJpbWl0aXZlID0gcHJpbWl0aXZlLnJlcGxhY2UgKC8nL2csIHNpbmdsZXF1b3RlKTtcbiAgICAgICAgcHJpbWl0aXZlID0gcHJpbWl0aXZlLnJlcGxhY2UgKC9cIi9nLCBkb3VibGVxdW90ZSk7XG4gICAgICAgIHByaW1pdGl2ZSA9IHByaW1pdGl2ZS5yZXBsYWNlICgvXFxcXC9nLCBiYWNrc2xhc2gpO1xuICAgICAgICBwcmltaXRpdmUgPSBwcmltaXRpdmUucmVwbGFjZSAoLzwvZywgbHQpO1xuXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcHJpbWl0aXZlID09PSAnc3ltYm9sJykge1xuXG4gICAgICAgIHByaW1pdGl2ZSA9ICdzeW1ib2wnO1xuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHN0cmluZ2lmeSB3b3VsZCBwcm9kdWNlICd7fScgd2hpY2ggaXMgbGVzcyB1c2VmdWxcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgcHJpbWl0aXZlID0gSlNPTi5zdHJpbmdpZnkgKHByaW1pdGl2ZSk7XG5cbiAgICB9IC8vIGVuZCBpZiAodHlwZW9mIHByaW1pdGl2ZSA9PT0gJ3N0cmluZycpXG4gICAgXG5cbiAgICAkKHBhcmVudCkgW3JlbExvY10gKHByaW1pdGl2ZSk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgLy8gdGV4dCBvYnMgaGF2ZSBubyBpZCdzOiBvbmx5IHRleHQgaXMgYXBwZW5kZWQgd2l0aCBubyB3YXkgdG8gYWRkcmVzcyBpdFxuICAgICAgICAvLyBpZiBhZGRyZXNzaW5nIGlzIG5lY2Vzc2FyeSwgdXNlIHNwYW4gaW5zdGVhZCBvZiB0ZXh0XG5cbn07IC8vIGVuZCBmLnRleHRNYWtlIFxuXG5cblxuLy8gUFVCTElDIFByb3BlcnRpZXMvTWV0aG9kc1xuY29uc3QgUCA9IHt9O1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5kaXNwbGF5T2IgPSAoZGlzcE9iKSA9PiB7XG4gICAgLy8gaWYgZGlzcE9iIGlzIGFuIGFycmF5LCBvbmx5IHRoZSBsYXN0IElkIGlzIHJldHVybmVkXG4gICAgXG4gICAgbGV0IHBhcmVudCA9ICdib2R5JztcbiAgICAgICAgLy8gaWYgcGFyZW50IG5vdCBmb3VuZCwgYXBwZW5kIHRvIGJvZHlcblxuICAgIGlmICh0eXBlb2YgZGlzcE9iID09PSAnb2JqZWN0JyAmJiBkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdwYXJlbnQnKSkge1xuXG4gICAgICAgIHBhcmVudCA9IGRpc3BPYi5wYXJlbnQ7XG5cbiAgICB9IC8vIGVuZCBpZiAodHlwZW9mIGRpc3BPYiA9PT0gJ29iamVjdCcgJiYgZGlzcE9iLmhhc093blByb3BlcnR5ICgncGFyZW50JykpXG4gICAgXG4gICAgY29uc3QgSWQgPSBmLmRpc3BsYXlPYkggKHBhcmVudCwgZGlzcE9iKTtcblxuICAgIHJldHVybiBJZDtcblxufTsgLy8gZW5kIFAuZGlzcGxheU9iIFxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5kaXNwbGF5T2JBID0gKGRpc3BPYkEpID0+IHtcbiAgICAvLyB0aGlzIGlzIHRoZSB3YXkgZGlzcGxheU9iIHNob3VsZCBoYXZlIGJlZW4gd3JpdHRlbiBpbiB0aGUgZmlyc3QgcGxhY2UsIHRvIGFsd2F5c1xuICAgIC8vIHJldHVybiBhbiBhcnJheSBpZiBJZHMsIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBhcnJheVxuICAgIFxuICAgIGxldCBJZHM7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkgKGRpc3BPYkEpKSB7XG5cbiAgICAgICAgY29uc3QgcGFyZW50ID0gZGlzcE9iQS5oYXNPd25Qcm9wZXJ0eSAoJ3BhcmVudCcpID8gZGlzcE9iQS5wYXJlbnQgOiAnYm9keSc7XG5cbiAgICAgICAgSWRzID0gW107XG4gICAgICAgIGZvciAobGV0IGl4ID0gMDsgaXggPCBkaXNwT2JBLmxlbmd0aDsgaXgrKykge1xuXG4gICAgICAgICAgICBjb25zdCBkaXNwT2IgPSBkaXNwT2JBIFtpeF07XG4gICAgICAgICAgICBsZXQgcGFyZW50SSA9IHBhcmVudDtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkaXNwT2IgPT09ICdvYmplY3QnICYmIGRpc3BPYi5oYXNPd25Qcm9wZXJ0eSAoJ3BhcmVudCcpKSB7XG5cbiAgICAgICAgICAgICAgICBwYXJlbnRJID0gZGlzcE9iLnBhcmVudDtcblxuICAgICAgICAgICAgfSAvLyBlbmQgaWYgKHR5cGVvZiBkaXNwT2IgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBJZHMucHVzaCAoZi5kaXNwbGF5T2JIIChwYXJlbnRJLCBkaXNwT2IpKTtcblxuICAgICAgICB9IC8vIGVuZCBmb3IgKGxldCBpeCA9IDA7IGl4IDwgZGlzcE9iQS5sZW5ndGg7IGl4KyspXG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIElkcyA9IFAuZGlzcGxheU9iIChkaXNwT2JBKTtcblxuICAgIH0gLy8gZW5kIGlmIChBcnJheS5pc0FycmF5IChkaXNwT2JBKSlcbiAgICBcbiAgICByZXR1cm4gSWRzO1xuXG59OyAvLyBlbmQgUC5kaXNwbGF5T2JBIFxuXG5cblAuZGlzcGxheVBhZ2UgPSBQLmRpc3BsYXlPYjtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAuZG91YmxlQ2xpY2tEZWxheSA9IChkZWxheSkgPT4ge1xuICAgIFxuICAgIHYuZGJsQ2xpY2tEZWxheSA9IGRlbGF5O1xuXG59OyAvLyBlbmQgUC5kb3VibGVDbGlja0RlbGF5IFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLmV2dE9uID0gKCkgPT4ge1xuICAgIFxuICAgIHYuZXZ0SXNPbiA9IHRydWU7XG5cbn07IC8vIGVuZCBQLmV2dE9uXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAuZXZ0T2ZmID0gKCkgPT4ge1xuICAgIFxuICAgIHYuZXZ0SXNPbiA9IGZhbHNlO1xuXG59OyAvLyBlbmQgUC5ldnRPZmZcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5nZW5JZCA9IChvYikgPT4ge1xuXG4gICAgY29uc3QgaWQgPSAnaScgKyB2LmlkKys7XG5cbiAgICBpZiAob2IpIHtcblxuICAgICAgICBvYi5pZCA9IGlkO1xuXG4gICAgfSAvLyBlbmQgaWYgKG9iKVxuICAgIFxuICAgIHJldHVybiBpZDtcblxufTsgLy8gZW5kIFAuZ2VuSWRcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5nZW5JZHMgPSAob2IpID0+IHtcbiAgICBcbiAgICBjb25zdCBpZCA9IG9iID8gUC5nZW5JZCAob2IpIDogUC5nZW5JZCAoKTtcbiAgICBjb25zdCBJZCA9ICcjJyArIGlkO1xuXG4gICAgcmV0dXJuIFtpZCwgSWRdO1xuXG59OyAvLyBlbmQgUC5nZW5JZHNcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAuSWRHZW4gPSAob2IpID0+IHtcbiAgICBcbiAgICBjb25zdCBJZCA9IFAuZ2VuSWRzIChvYikgWzFdO1xuICAgIHJldHVybiBJZDtcblxufTsgLy8gZW5kIFAuSWRHZW4gXG5cblxuXG5BLmluaXQgKCk7XG5cbnJldHVybiBQO1xuXG59KCkpO1xuXG5cblxuIiwiLy8gZ28ta2V5L2luZGV4LmpzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGpxU2VsZWN0b3IsIHJlcG9ydFNoaWZ0LCBrZXlEb3duSGFuZGxlciwgcmVwb3J0VXAsIGtleVVwSGFuZGxlciwgYWxsb3dQcm9wYWdhdGlvbikge1xuXG4vLyBQUklWQVRFIFByb3BlcnRpZXMvTWV0aG9kc1xuY29uc3QgdiA9IHtcblxuICAgIGpxU2VsZWN0b3I6ICdib2R5JyxcbiAgICByZXBvcnRTaGlmdDogZmFsc2UsXG4gICAga2V5RG93bkhhbmRsZXI6IG51bGwsXG4gICAgcmVwb3J0VXA6IGZhbHNlLFxuICAgIGtleVVwSGFuZGxlcjogbnVsbCxcblxuICAgIGtTaGlmdDogZmFsc2UsXG4gICAga0N0cmw6IGZhbHNlLFxuICAgIGtBbHQ6IGZhbHNlLFxuICAgIGtDbWQ6IGZhbHNlLFxuICAgIGtJZ25vcmU6IGZhbHNlLFxuICAgIHdoaWNoU2hpZnRLZXlzOiB7MTY6MSwgMTc6MSwgMTg6MSwgOTE6MSwgOTI6MSwgOTM6MSwgMjI0OjF9LFxuXG4gICAgICAgICAgICAvLyBub3QgcHJpbnRhYmxlIG9yIG5vbi1hc2NpaSBibG9ja1xuICAgIGN0cmxPck5vbkFzY2lpOiB7XG4gICAgICAgIDg6ICdCYWNrc3BhY2UnLFxuICAgICAgICA5OiAnVGFiJyxcbiAgICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAgIDE2OiAnU2hpZnQnLFxuICAgICAgICAxNzogJ0N0cmwnLFxuICAgICAgICAxODogJ0FsdCcsXG4gICAgICAgIDE5OiAnUGF1c2UtYnJlYWsnLFxuICAgICAgICAyMDogJ0NhcHMtbG9jaycsXG4gICAgICAgIDI3OiAnRXNjJyxcbiAgICAgICAgMzI6ICcgJywgIC8vIFNwYWNlXG4gICAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgICAgMzQ6ICdQYWdlRG93bicsXG4gICAgICAgIDM1OiAnRW5kJyxcbiAgICAgICAgMzY6ICdIb21lJyxcbiAgICAgICAgMzc6ICdMZWZ0JyxcbiAgICAgICAgMzg6ICdVcCcsXG4gICAgICAgIDM5OiAnUmlnaHQnLFxuICAgICAgICA0MDogJ0Rvd24nLFxuICAgICAgICA0NTogJ0luc2VydCcsXG4gICAgICAgIDQ2OiAnRGVsZXRlJyxcbiAgICAgICAgOTE6ICdXaW5kb3dzS2V5TGVmdCcsXG4gICAgICAgIDkyOiAnV2luZG93c0tleVJpZ2h0JyxcbiAgICAgICAgOTM6ICdXaW5kb3dzT3B0aW9uS2V5JyxcbiAgICAgICAgOTY6ICcwJywgIC8vIE51bXBhZFxuICAgICAgICA5NzogJzEnLCAgLy8gTnVtcGFkXG4gICAgICAgIDk4OiAnMicsICAvLyBOdW1wYWRcbiAgICAgICAgOTk6ICczJywgIC8vIE51bXBhZFxuICAgICAgICAxMDA6ICc0JywgIC8vIE51bXBhZFxuICAgICAgICAxMDE6ICc1JywgIC8vIE51bXBhZFxuICAgICAgICAxMDI6ICc2JywgIC8vIE51bXBhZFxuICAgICAgICAxMDM6ICc3JywgIC8vIE51bXBhZFxuICAgICAgICAxMDQ6ICc4JywgIC8vIE51bXBhZFxuICAgICAgICAxMDU6ICc5JywgIC8vIE51bXBhZFxuICAgICAgICAxMDY6ICcqJywgIC8vIE51bXBhZFxuICAgICAgICAxMDc6ICcrJywgIC8vIE51bXBhZFxuICAgICAgICAxMDk6ICctJywgIC8vIE51bXBhZFxuICAgICAgICAxMTA6ICcuJywgIC8vIE51bXBhZFxuICAgICAgICAxMTE6ICcvJywgIC8vIE51bXBhZFxuICAgICAgICAxMTI6ICdGMScsXG4gICAgICAgIDExMzogJ0YyJyxcbiAgICAgICAgMTE0OiAnRjMnLFxuICAgICAgICAxMTU6ICdGNCcsXG4gICAgICAgIDExNjogJ0Y1JyxcbiAgICAgICAgMTE3OiAnRjYnLFxuICAgICAgICAxMTg6ICdGNycsXG4gICAgICAgIDExOTogJ0Y4JyxcbiAgICAgICAgMTIwOiAnRjknLFxuICAgICAgICAxMjE6ICdGMTAnLFxuICAgICAgICAxMjI6ICdGMTEnLFxuICAgICAgICAxMjM6ICdGMTInLFxuICAgICAgICAxNDQ6ICdOdW1sb2NrJyxcbiAgICAgICAgMTQ1OiAnU2Nyb2xsLWxvY2snLFxuICAgICAgICAyMjQ6ICdNYWNDbWQnLFxuICAgIH0sXG4gICAgXG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhc2NpaVVuU2hpZnRlZDoge1xuICAgICAgICA0ODogJzAnLFxuICAgICAgICA0OTogJzEnLFxuICAgICAgICA1MDogJzInLFxuICAgICAgICA1MTogJzMnLFxuICAgICAgICA1MjogJzQnLFxuICAgICAgICA1MzogJzUnLFxuICAgICAgICA1NDogJzYnLFxuICAgICAgICA1NTogJzcnLFxuICAgICAgICA1NjogJzgnLFxuICAgICAgICA1NzogJzknLFxuICAgICAgICA1OTogJzsnLFxuICAgICAgICA2MTogJz0nLFxuICAgICAgICA2NTogJ2EnLFxuICAgICAgICA2NjogJ2InLFxuICAgICAgICA2NzogJ2MnLFxuICAgICAgICA2ODogJ2QnLFxuICAgICAgICA2OTogJ2UnLFxuICAgICAgICA3MDogJ2YnLFxuICAgICAgICA3MTogJ2cnLFxuICAgICAgICA3MjogJ2gnLFxuICAgICAgICA3MzogJ2knLFxuICAgICAgICA3NDogJ2onLFxuICAgICAgICA3NTogJ2snLFxuICAgICAgICA3NjogJ2wnLFxuICAgICAgICA3NzogJ20nLFxuICAgICAgICA3ODogJ24nLFxuICAgICAgICA3OTogJ28nLFxuICAgICAgICA4MDogJ3AnLFxuICAgICAgICA4MTogJ3EnLFxuICAgICAgICA4MjogJ3InLFxuICAgICAgICA4MzogJ3MnLFxuICAgICAgICA4NDogJ3QnLFxuICAgICAgICA4NTogJ3UnLFxuICAgICAgICA4NjogJ3YnLFxuICAgICAgICA4NzogJ3cnLFxuICAgICAgICA4ODogJ3gnLFxuICAgICAgICA4OTogJ3knLFxuICAgICAgICA5MDogJ3onLFxuICAgICAgICAxNzM6ICctJyxcbiAgICAgICAgMTg4OiAnLCcsXG4gICAgICAgIDE5MDogJy4nLFxuICAgICAgICAxOTE6ICcvJyxcbiAgICAgICAgMTkyOiAnYCcsXG4gICAgICAgIDIxOTogJ1snLFxuICAgICAgICAyMjA6IFwiXFxcXFwiLFxuICAgICAgICAyMjE6ICddJyxcbiAgICAgICAgMjIyOiBcIidcIixcbiAgICAxODY6IFwiO1wiLCAgLy8gZGl0dG8gZm9yICc7J1xuICAgIDE4NzogXCI9XCIsICAvLyBhcHBhcmVudGx5LCBjaHJvbWUgdGhpbmtzIHdoaWNoIGlzIDE4NyBmb3IgJz0nLCBidXQgbm90IGZpcmVmb3hcbiAgICAxODk6IFwiLVwiLCAgLy8gZGl0dG8gZm9yICctJ1xuICAgIH0sXG4gICAgXG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhc2NpaVNoaWZ0ZWQ6IHtcbiAgICAgICAgNDg6ICcpJyxcbiAgICAgICAgNDk6ICchJyxcbiAgICAgICAgNTA6ICdAJyxcbiAgICAgICAgNTE6ICcjJyxcbiAgICAgICAgNTI6ICckJyxcbiAgICAgICAgNTM6ICclJyxcbiAgICAgICAgNTQ6ICdeJyxcbiAgICAgICAgNTU6ICcmJyxcbiAgICAgICAgNTY6ICcqJyxcbiAgICAgICAgNTc6ICcoJyxcbiAgICAgICAgNTk6ICc6JyxcbiAgICAgICAgNjE6ICcrJyxcbiAgICAgICAgNjU6ICdBJyxcbiAgICAgICAgNjY6ICdCJyxcbiAgICAgICAgNjc6ICdDJyxcbiAgICAgICAgNjg6ICdEJyxcbiAgICAgICAgNjk6ICdFJyxcbiAgICAgICAgNzA6ICdGJyxcbiAgICAgICAgNzE6ICdHJyxcbiAgICAgICAgNzI6ICdIJyxcbiAgICAgICAgNzM6ICdJJyxcbiAgICAgICAgNzQ6ICdKJyxcbiAgICAgICAgNzU6ICdLJyxcbiAgICAgICAgNzY6ICdMJyxcbiAgICAgICAgNzc6ICdNJyxcbiAgICAgICAgNzg6ICdOJyxcbiAgICAgICAgNzk6ICdPJyxcbiAgICAgICAgODA6ICdQJyxcbiAgICAgICAgODE6ICdRJyxcbiAgICAgICAgODI6ICdSJyxcbiAgICAgICAgODM6ICdTJyxcbiAgICAgICAgODQ6ICdUJyxcbiAgICAgICAgODU6ICdVJyxcbiAgICAgICAgODY6ICdWJyxcbiAgICAgICAgODc6ICdXJyxcbiAgICAgICAgODg6ICdYJyxcbiAgICAgICAgODk6ICdZJyxcbiAgICAgICAgOTA6ICdaJyxcbiAgICAgICAgMTczOiAnXycsXG4gICAgICAgIDE4ODogJzwnLFxuICAgICAgICAxOTA6ICc+JyxcbiAgICAgICAgMTkxOiAnPycsXG4gICAgICAgIDE5MjogJ34nLFxuICAgICAgICAyMTk6ICd7JyxcbiAgICAgICAgMjIwOiAnfCcsXG4gICAgICAgIDIyMTogJ30nLFxuICAgICAgICAyMjI6ICdcIicsXG4gICAgMTg2OiBcIjpcIiwgIC8vIGRpdHRvIGZvciAnOidcbiAgICAxODc6IFwiK1wiLCAgLy8gZGl0dG8gZm9yICcrJ1xuICAgIDE4OTogXCJfXCIsICAvLyBkaXR0byBmb3IgJy0nXG4gICAgfSxcblxuXG59OyAvLyBlbmQgUFJJVkFURSBwcm9wZXJ0aWVzXG5jb25zdCBBID0ge307XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQS5pbml0ID0gKCkgPT4ge1xuICAgIFxuICAgIHYuanFTZWxlY3RvciA9IGpxU2VsZWN0b3IgPyBqcVNlbGVjdG9yIDogJ2JvZHknO1xuICAgIHYucmVwb3J0U2hpZnQgPSByZXBvcnRTaGlmdCA/IHJlcG9ydFNoaWZ0IDogZmFsc2U7XG4gICAgdi5rZXlEb3duSGFuZGxlciA9IGtleURvd25IYW5kbGVyID8ga2V5RG93bkhhbmRsZXIgOiBmLmRlZmF1bHRIYW5kbGVyO1xuICAgIHYucmVwb3J0VXAgPSByZXBvcnRVcCA/IHJlcG9ydFVwIDogZmFsc2U7XG4gICAgdi5rZXlVcEhhbmRsZXIgPSBrZXlVcEhhbmRsZXIgPyBrZXlVcEhhbmRsZXIgOiBmLmRlZmF1bHRIYW5kbGVyO1xuICAgIHYuYWxsb3dQcm9wYWdhdGlvbiA9IGFsbG93UHJvcGFnYXRpb247XG5cbiAgICAvL1Auc2V0S2V5T24gKHYuanFTZWxlY3Rvcik7XG4gICAgUC5zZXRLZXlPbiAoKTtcbiAgICBpZiAodHlwZW9mIF9tMCA9PT0gJ3VuZGVmaW5lZCcpIHtcblxuICAgICAgICBfbTAgPSB7fTtcblxuICAgIH0gLy8gZW5kIGlmICh0eXBlb2YgX20wID09PSAndW5kZWZpbmVkJylcbiAgICBcbiAgICBcbiAgICBpZiAoIV9tMC5rZXlFdmVudHMpIHtcblxuICAgICAgICBfbTAua2V5RXZlbnRzID0ge307XG4gICAgICAgIC8qXG4gICAgICAgICAgICAvLyBvdmVycmlkZSBqcXVlcnkncyByZW1vdmUgZnVuY3Rpb24gdG8gdHVybiBvbiBhbGwga2V5IGhhbmRsZXJzIGFmdGVyIHJlbW92YWwgb2YgYSBmb3JtXG4gICAgICAgIGNvbnN0IHJtT3JpZyA9ICQuZm4ucmVtb3ZlO1xuICAgICAgICAkLmZuLnJlbW92ZSA9IGZ1bmN0aW9uICgpe1xuXG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAuaGFzICgnZm9ybScpXG4gICAgICAgICAgICAuZWFjaCAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFAuYWxsS2V5c09uICgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJtT3JpZy5hcHBseSAodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuXG4gICAgfSAvLyBlbmQgaWYgKCFfbTAua2V5RXZlbnRzKVxuXG4gICAgY29uc3Qga2V5RXZlbnRzID0gX20wLmtleUV2ZW50cztcbiAgICBrZXlFdmVudHMgW3YuanFTZWxlY3Rvcl0gPSB7b246IFAuc2V0S2V5T24sIG9mZjogUC5zZXRLZXlPZmZ9O1xuICAgIFxuXG59OyAvLyBlbmQgQS5pbml0XG5cbmNvbnN0IGNiID0ge307XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jYi5jS2V5RG93biA9IChldmVudCkgPT4ge1xuICAgIC8vIGNhbGxiYWNrIGlzIHYua2V5RG93bkhuZGxlclxuICAgIC8vIHJldHVybnMgY2ggb2JqZWN0IHJlZmxlY3Rpbmcgd2hpY2ggc2hpZnQga2V5cyB3ZXJlIHByZXNzZWQgZG93biwgY2ggYW5kIHdoaWNoIHZhbHVlc1xuICAgIC8vXG4gICAgLy8gdi5yZXBvcnRTaGlmdCB0cnVlID0+IHRyaWdnZXIgY2FsbGJhY2sgZm9yIGVhY2gga2V5ZG93biBldmVudCBvZiBhbnkga2V5LCBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkaW5nIGFueSBzaGlmdCBrZXlcbiAgICAvLyAgICAgZmFsc2UgPT4gc2hpZnQga2V5IGV2ZW50IHJlcG9ydGVkIG9ubHkgd2hlbiB0aGUgbmV4dCBub24tc2hpZnQga2V5ZG93biBldmVudC5cbiAgICAvLyAgICAgICAgICAgICAgU28sIGNhbGxiYWNrIGlzIG9ubHkgdHJpZ2dlcmVkIGZvciBub24tc2hpZnQga2V5IGV2ZW50c1xuICAgIFxuICAgIC8vY29uc29sZS5sb2cgKCdnby1rZXkuY0tleURvd24ganFTZWxlY3RvcjogJyArIHYuanFTZWxlY3Rvcik7XG5cbiAgICBjb25zdCB3aGljaCA9IGV2ZW50LndoaWNoO1xuXG4gICAgICAgIC8vIG5ldmVyIGlnbm9yZSAnRXNjJyBrZXkgPT0gMjdcbiAgICBpZiAodi5rSWdub3JlICYmIHdoaWNoICE9IDI3KSB7XG5cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgfSAvLyBlbmQgaWYgKGtJZ25vcmUpXG4gICAgXG4gICAgaWYgKCFhbGxvd1Byb3BhZ2F0aW9uKSB7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uICgpO1xuXG4gICAgfSAvLyBlbmQgaWYgKCFhbGxvd1Byb3BhZ2F0aW9uKVxuXG4gICAgbGV0IGlzQVNoaWZ0S2V5ID0gdHJ1ZTtcbiAgICBzd2l0Y2ggKHdoaWNoKSB7XG5cbiAgICAgICAgY2FzZSAxNjogXG4gICAgICAgICAgICB2LmtTaGlmdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDE3OiBcbiAgICAgICAgICAgIHYua0N0cmwgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAxODogXG4gICAgICAgICAgICB2LmtBbHQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSA5MTogXG4gICAgICAgIGNhc2UgOTI6IFxuICAgICAgICBjYXNlIDkzOiBcbiAgICAgICAgY2FzZSAyMjQ6XG4gICAgICAgICAgICB2LmtDbWQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlzQVNoaWZ0S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcblxuICAgIH0gICBcblxuICAgIGYuY0tleVVwRG93bkZpbmlzaCAoaXNBU2hpZnRLZXksIHdoaWNoLCB2LmtleURvd25IYW5kbGVyKTtcblxuICAgIC8qXG4gICAgaWYgKCFpc0FTaGlmdEtleSkge1xuXG4gICAgICAgIHYua1NoaWZ0ID0gZmFsc2U7XG4gICAgICAgIHYua0N0cmwgPSBmYWxzZTtcbiAgICAgICAgdi5rQWx0ID0gZmFsc2U7XG4gICAgICAgIHYua0NtZCA9IGZhbHNlO1xuXG4gICAgfSAvLyBlbmQgaWYgKCFpc0FTaGlmdEtleSlcbiAgICAqL1xuICAgIFxuXG59OyAvLyBlbmQgY2IuY0tleURvd24gXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNiLmNLZXlVcCA9IChldmVudCkgPT4ge1xuICAgIC8vIGNhbGxiYWNrIGlzIHYua2V5RG93bkhuZGxlclxuICAgIFxuICAgIGNvbnN0IHdoaWNoID0gZXZlbnQud2hpY2g7XG5cbiAgICAgICAgLy8gbmV2ZXIgaWdub3JlICdFc2MnIGtleSA9PSAyN1xuICAgIGlmICh2LmtJZ25vcmUgJiYgd2hpY2ggIT0gMjcpIHtcblxuICAgICAgICByZXR1cm47XG5cbiAgICB9IC8vIGVuZCBpZiAoa0lnbm9yZSlcbiAgICBcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbiAoKTtcblxuICAgIGxldCBpc0FTaGlmdEtleSA9IHRydWU7XG4gICAgc3dpdGNoICh3aGljaCkge1xuXG4gICAgICAgIGNhc2UgMTY6IFxuICAgICAgICAgICAgdi5rU2hpZnQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE3OiBcbiAgICAgICAgICAgIHYua0N0cmwgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE4OiBcbiAgICAgICAgICAgIHYua0FsdCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgOTE6IFxuICAgICAgICBjYXNlIDkyOiBcbiAgICAgICAgY2FzZSA5MzogXG4gICAgICAgIGNhc2UgMjI0OiBcbiAgICAgICAgICAgIHYua0NtZCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlzQVNoaWZ0S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcblxuICAgIH0gICBcblxuICAgIGlmICghdi5yZXBvcnRVcCkge1xuXG4gICAgICAgIHJldHVybjtcblxuICAgIH0gLy8gZW5kIGlmICghcmVwb3J0VXApXG4gICAgXG4gICAgZi5jS2V5VXBEb3duRmluaXNoIChpc0FTaGlmdEtleSwgd2hpY2gsIHYua2V5VXBIYW5kbGVyKTtcblxufTsgLy8gZW5kIGNiLmNLZXlVcCBcblxuY29uc3QgZiA9IHt9O1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYuY0tleVVwRG93bkZpbmlzaCA9IChpc0FTaGlmdEtleSwgd2hpY2gsIGNhbGxiYWNrKSA9PiB7XG4gICAgXG4gICAgaWYgKGlzQVNoaWZ0S2V5ICYmICF2LnJlcG9ydFNoaWZ0KSB7XG5cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgfSAvLyBlbmQgaWYgKGlzQVNoaWZ0S2V5ICYmICF2LnJlcG9ydFNoaWZ0KVxuICAgIFxuICAgIGNvbnN0IHRoaXNDaCA9IGYuZ2V0S2V5Q29kZSAod2hpY2gpO1xuXG4gICAgY29uc3QgY2hPYiA9ICh7XG4gICAgICAgIHNoaWZ0OiB2LmtTaGlmdCxcbiAgICAgICAgY3RybDogdi5rQ3RybCxcbiAgICAgICAgYWx0OiB2LmtBbHQsXG4gICAgICAgIG1hY0NtZDogdi5rQ21kLFxuICAgICAgICB3aGljaDogd2hpY2gsXG4gICAgICAgIGNoOiB0aGlzQ2gsXG4gICAgICAgIGlzQVNoaWZ0S2V5OiBpc0FTaGlmdEtleSxcbiAgICB9KTtcblxuICAgIC8vIGNvbnNvbGUubG9nICgnY2hPYjogJyArIEpTT04uc3RyaW5naWZ5IChjaE9iKSArICdcXG4nKTtcbiAgICAvKlxuICAgIGlmICh2LnJlcG9ydFNoaWZ0KSB7XG5cbiAgICAgICAgY2hPYi5pc0FTaGlmdEtleSA9IGlzQVNoaWZ0S2V5OyAgXG4gICAgICAgICAgICAvLyB0cnVlIGlmIGFueSBvZjogc2hpZnQsIGN0cmwsIGFsdCwgb3IgbWFjQ21kIGFyZSB0cnVlXG4gICAgICAgICAgICAvLyBvbmx5IHJlbGV2YW50IGlmIHYucmVwb3J0U2hpZnQgaXMgdHJ1ZVxuXG4gICAgfSAvLyBlbmQgaWYgKHYucmVwb3J0U2hpZnQpXG4gICAgKi9cblxuICAgIGNhbGxiYWNrIChjaE9iKTtcblxufTsgLy8gZW5kIGYuY0tleVVwRG93bkZpbmlzaCBcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5kZWZhdWx0SGFuZGxlciA9IChjaE9iKSA9PiB7XG4gICAgXG4gICAgY29uc3QgY2hPYlMgPSBKU09OLnN0cmluZ2lmeSAoY2hPYik7XG4gICAgY29uc29sZS5sb2cgKCdnby1rZXkuZGVmYXVsdEhhbmRsZXIuY2hPYjogJyArIGNoT2JTKTtcblxufTsgLy8gZW5kIGYuZGVmYXVsdEhhbmRsZXIgXG5cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5nZXRLZXlDb2RlID0gKHdoaWNoKSA9PiB7XG4gICAgXG5cbiAgICBsZXQgY2g7XG5cbiAgICBpZiAodi5jdHJsT3JOb25Bc2NpaS5oYXNPd25Qcm9wZXJ0eSAod2hpY2gpKSB7XG5cbiAgICAgICAgY2ggPSB2LmN0cmxPck5vbkFzY2lpIFt3aGljaF07XG5cbiAgICB9IGVsc2UgaWYgKHYua1NoaWZ0ICYmIHYuYXNjaWlTaGlmdGVkLmhhc093blByb3BlcnR5ICh3aGljaCkpIHtcblxuICAgICAgICBjaCA9IHYuYXNjaWlTaGlmdGVkIFt3aGljaF07XG5cbiAgICB9IGVsc2UgaWYgKCF2LmtTaGlmdCAmJiB2LmFzY2lpVW5TaGlmdGVkLmhhc093blByb3BlcnR5ICh3aGljaCkpIHtcblxuICAgICAgICBjaCA9IHYuYXNjaWlVblNoaWZ0ZWQgW3doaWNoXTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgY2ggPSBudWxsO1xuXG4gICAgfSAvLyBlbmQgaWYgXG5cbiAgICByZXR1cm4gY2g7XG5cbn07IC8vIGVuZCBmLmdldEtleUNvZGUgXG5cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5pbml0S2V5RG93biA9IChqcVNlbGVjdG9yKSA9PiB7XG4gICAgXG4gICAgJChqcVNlbGVjdG9yKVxuICAgIC5vZmYoJ2tleWRvd24nKVxuICAgIC5rZXlkb3duIChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyAoJyA9PT4gaW5pdEtleURvd24nKTtcbiAgICAgICAgY2IuY0tleURvd24gKGV2ZW50KTtcbiAgICB9KTtcblxufTsgLy8gZW5kIGYuaW5pdEtleURvd24gXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYuaW5pdEtleVVwID0gKGpxU2VsZWN0b3IpID0+IHtcbiAgICBcbiAgICAkKGpxU2VsZWN0b3IpXG4gICAgLm9mZigna2V5dXAnKVxuICAgIC5rZXl1cCAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2cgKCcgPT0+IGluaXRLZXlVcCcpO1xuICAgICAgICBjYi5jS2V5VXAgKGV2ZW50KTtcbiAgICB9KTtcblxufTsgLy8gZW5kIGYuaW5pdEtleVVwIFxuXG5cblxuLy8gUFVCTElDIFByb3BlcnRpZXMvTWV0aG9kc1xuY29uc3QgUCA9IHt9O1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5hbGxLZXlzT2ZmID0gKCkgPT4ge1xuICAgIFxuICAgIGNvbnN0IGtleUV2ZW50cyA9IF9tMC5rZXlFdmVudHM7XG4gICAgY29uc3Qga2V5U2VscyA9IE9iamVjdC5rZXlzIChrZXlFdmVudHMpO1xuXG4gICAga2V5U2Vscy5mb3JFYWNoIChmdW5jdGlvbiAoZWwpIHtcblxuICAgICAgICBrZXlFdmVudHMgW2VsXS5vZmYgKCk7XG4gICAgfSk7XG5cbn07IC8vIGVuZCBQLmFsbEtleXNPZmZcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5hbGxLZXlzT24gPSAoKSA9PiB7XG4gICAgXG4gICAgY29uc3Qga2V5RXZlbnRzID0gX20wLmtleUV2ZW50cztcbiAgICBjb25zdCBrZXlTZWxzID0gT2JqZWN0LmtleXMgKGtleUV2ZW50cyk7XG5cbiAgICBrZXlTZWxzLmZvckVhY2ggKGZ1bmN0aW9uIChlbCkge1xuXG4gICAgICAgIGtleUV2ZW50cyBbZWxdLm9uICgpO1xuICAgIH0pO1xuXG59OyAvLyBlbmQgUC5hbGxLZXlzT25cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5zZXRLZXlPZmYgPSAoKSA9PiB7XG4gICAgICAgIC8vICQoJ2JvZHknKS5wcmVwZW5kIChgc2V0S2V5T2ZmLi4uYCk7XG4gICAgXG4gICAgICAgIC8vY29uc29sZS5sb2cgKCdTRVRLRVlPRkYgZ28ta2V5LnNldEtleU9mZiAgICAganFTZWxlY3RvciA9ICcgKyB2LmpxU2VsZWN0b3IpO1xuICAgICQodi5qcVNlbGVjdG9yKVxuICAgIC5vZmYgKCdrZXlkb3duJylcbiAgICAub2ZmICgna2V5dXAnKTtcblxufTsgLy8gZW5kIFAuc2V0S2V5T2ZmXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vUC5zZXRLZXlPbiA9IChqcVNlbCkgPT4ge1xuUC5zZXRLZXlPbiA9ICgpID0+IHtcbiAgICAgICAgLy8gJCgnYm9keScpLnByZXBlbmQgKGBzZXRLZXlPbi4uLmApO1xuICAgIFxuICAgICAgICAvL2NvbnNvbGUubG9nICgnU0VUS0VZT04gZ28ta2V5LnNldEtleU9uICAganFTZWxlY3RvciA9ICcgKyB2LmpxU2VsZWN0b3IpO1xuICAgIC8vZi5pbml0S2V5VXAgKGpxU2VsKTtcbiAgICAvL2YuaW5pdEtleURvd24gKGpxU2VsKTtcbiAgICBmLmluaXRLZXlVcCAodi5qcVNlbGVjdG9yKTtcbiAgICBmLmluaXRLZXlEb3duICh2LmpxU2VsZWN0b3IpO1xuXG59OyAvLyBlbmQgUC5zZXRLZXlIYW5kbGVyXG5cbi8vIGVuZCBQVUJMSUMgc2VjdGlvblxuXG5BLmluaXQgKCk7XG5cbnJldHVybiBQO1xuXG59O1xuIiwiLy8ga2V5VGVzdC5qc1xuXG4oZnVuY3Rpb24gKCkge1xuXG4kKGRvY3VtZW50KS5yZWFkeSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGoyaCA9IHJlcXVpcmUgKCdnby1qc29uMmh0bWwnKTtcbiAgICB2YXIga3kgPSByZXF1aXJlICgnZ28ta2V5Jyk7XG5cbiAgICB2YXIgZHBwID0gajJoLmRpc3BsYXlQYWdlO1xuICAgIHZhciBnZW5JZCA9IGoyaC5nZW5JZDtcblxuICAgIHZhciBpZCA9IGdlbklkICgpO1xuICAgIGRwcCAoe2RpdjogW1xuICAgICAgICB7bGFiZWw6ICdrZXkgZG93biBldmVudCcsIHN0eWxlOiBcImJhY2tncm91bmQtY29sb3I6ICNmZmNjY2M7XCJ9LCBcbiAgICAgICAge3ByZToge1xuICAgICAgICAgICAgc3BhbjogJ3ByZXNzIGFueSBzaGlmdC9rZXkgY29tYmluYXRpb24nLCBcbiAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9LCBzdHlsZTogXCJtYXJnaW46IDA7XCJ9XG4gICAgXSwgc3R5bGU6IFwiYm9yZGVyOiAxcHggc29saWQgYmx1ZTtcIiArXG4gICAgICAgIFwiYm9yZGVyLXJhZGl1czogNHB4O1wiICtcbiAgICAgICAgXCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XCIgK1xuICAgICAgICBcInBhZGRpbmc6IDRweDtcIn0pO1xuXG4gICAgdmFyIElkID0gJyMnICsgaWQ7XG4gICAgICAgIC8vIGpxdWVyeSBhZGRyZXNzYWJsZVxuXG4gICAgZnVuY3Rpb24gcmVwb3J0S2V5IChjaE9iKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgc2VlSXQgPSBcIlwiO1xuXG4gICAgICAgIHZhciBubCA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIGsgaW4gY2hPYikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWVJdCArPSBubCArIGsgKyAnOiAnICsgY2hPYltrXTtcbiAgICAgICAgICAgIG5sID0gJ1xcbic7XG4gICAgICAgIH1cblxuICAgICAgICAkKElkKVxuICAgICAgICAuZW1wdHkgKClcbiAgICAgICAgLmFwcGVuZCAoc2VlSXQpO1xuXG4gICAgfTtcblxuICAgIGt5ID0gbmV3IGt5ICgnYm9keScsIGZhbHNlLCByZXBvcnRLZXkpO1xufSk7XG5cbn0pICgpO1xuXG5cbiIsIi8vIGdvLW1zZy9pbmRleC5qc1xuLy8gZ28tbXNnIG9iamVjdCBoYXMgYSB1bmlxdWUgcHJpbWFyeSBtc2cgYW5kIHplcm8gb3IgbW9yZSBvcHRpb25hbCBhdHRyaWJ1dGVzXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocDApIHtcblxuY29uc3QgdiA9IHtcblxuICAgIHByaW1hcnk6IG51bGwsXG4gICAgICAgIC8vIHByaW1hcnk6IHtjbWQ6IDF9IChjb250YWlucyBvcHRpb25hbCBjb250ZW50KSBvciB7Y21kOiAwfSAobm8gb3B0aW9uYWwgY29udGVudCBhbGxvd2VkKVxuXG4gICAgc2Vjb25kYXJ5OiBudWxsLFxuICAgICAgICAvLyBpZiBhIHByaW1hcnkgbWVzc2FnZSBoYXMgYW4gb3B0aW9uYWwgYXR0cmlidXRlIHRoYXQgY29uY2lkZW50YWxseSBpcyB0aGUgc2FtZSBhc1xuICAgICAgICAvLyBhbm90aGVyIHByaW1hcnkgbWVzc2FnZSwgaXQgc2hvdWxkIGJlIGhhdmUgYSBrZXkvdmFsdWUgcGFpciBpbiBzZWNvbmRhcnkge2F0dHI6IDF9XG4gICAgICAgIC8vIHRvIGVuc3VyZSB0aGF0IGl0IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiBhdHRyaWJ1dGUgaW4gY2FzZSBhIHByaW1hcnkgaXMgcHJlc2VudFxuICAgICAgICAvLyBTZWNvbmRhcnkgaXMgb25seSB0ZXN0ZWQgaWYgdGhlcmUgZXhpc3RzIGEgcHJpbWFyeSBrZXlcblxuICAgIG1ldGE6IG51bGwsXG4gICAgICAgIC8vIG1ldGEgcGFyYW1ldGVycyBpbnRlbmRlZCBmb3IgY3RybCBvciBvdGhlciBwdXJwb3NlIG91dHNpZGUgb2YgcHJpbWFyeSBhbmQgc2Vjb25kYXJ5IG1zZ1xuICAgICAgICAvLyBwYXJhbWV0ZXIgdXNhZ2VcblxufTsgIFxuXG5jb25zdCBBID0ge307XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQS5pbml0ID0gKCkgPT4ge1xuXG4gICAgdi5wcmltYXJ5ID0gcDAucHJpbWFyeTtcbiAgICB2LnNlY29uZGFyeSA9IHAwLmhhc093blByb3BlcnR5ICgnc2Vjb25kYXJ5JykgPyBwMC5zZWNvbmRhcnkgOiB7fTtcbiAgICB2Lm1ldGEgPSBwMC5oYXNPd25Qcm9wZXJ0eSAoJ21ldGEnKSA/IHAwLm1ldGEgOiB7fTtcblxufTsgLy8gZW5kIEEuaW5pdFxuXG5cbmNvbnN0IGYgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYucGFyc2VNc2cgPSAobXNnT2IpID0+IHtcbiAgICBcbiAgICBjb25zdCByZXMgPSB7fTtcbiAgICBjb25zdCBtc2dLZXlzID0gT2JqZWN0LmtleXMgKG1zZ09iKTtcblxuICAgIGNvbnN0IHByaW1hcnlDYW5kaWRhdGVzT2IgPSB7fTtcbiAgICBjb25zdCBhdHRyc09iID0ge307XG4gICAgY29uc3QgbWV0YU9iID0ge307XG5cbiAgICBsZXQga2V5O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXNnS2V5cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIGtleSA9IG1zZ0tleXMgW2ldO1xuICAgICAgICBcbiAgICAgICAgaWYgKHYucHJpbWFyeS5oYXNPd25Qcm9wZXJ0eSAoa2V5KSkge1xuXG4gICAgICAgICAgICBwcmltYXJ5Q2FuZGlkYXRlc09iIFtrZXldID0gMTtcblxuICAgICAgICB9IGVsc2UgaWYgKHYubWV0YS5oYXNPd25Qcm9wZXJ0eSAoa2V5KSkge1xuXG4gICAgICAgICAgICBtZXRhT2IgW2tleV0gPSBtc2dPYiBba2V5XTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBhdHRyc09iIFtrZXldID0gbXNnT2IgW2tleV07XG5cbiAgICAgICAgfSAvLyBlbmQgaWYgKHYucHJpbWFyeS5oYXNPd25Qcm9wZXJ0eSAoa2V5KSlcbiAgICAgICAgXG4gICAgfSAvLyBlbmQgZm9yIChsZXQgaSA9IDA7IGkgPCBtc2dLZXlzLmxlbmd0aDsgaSsrKVxuXG4gICAgY29uc3QgcHJpbWFyeUNhbmRpZGF0ZXNBID0gT2JqZWN0LmtleXMgKHByaW1hcnlDYW5kaWRhdGVzT2IpO1xuXG4gICAgbGV0IHByaW1hcnlLZXkgPSBudWxsO1xuXG4gICAgaWYgKHByaW1hcnlDYW5kaWRhdGVzQS5sZW5ndGggPT09IDEpIHtcblxuICAgICAgICBwcmltYXJ5S2V5ID0gcHJpbWFyeUNhbmRpZGF0ZXNBIFswXTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGhhbmRsZSBwcmltYXJ5L3NlY29uZGFyeSBrZXkgcmVzb2x1dGlvblxuXG4gICAgICAgIGZvciAoa2V5IGluIHByaW1hcnlDYW5kaWRhdGVzT2IpIHtcblxuICAgICAgICAgICAgaWYgKHYuc2Vjb25kYXJ5Lmhhc093blByb3BlcnR5IChrZXkpKSB7XG5cbiAgICAgICAgICAgICAgICBhdHRyc09iIFtrZXldID0gbXNnT2IgW2tleV07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJpbWFyeUtleSA9PT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnlLZXkgPSBrZXk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHJlcy5lcnIgPSAnTXVsdGlwbGUgcHJpbWFyeSBrZXlzIGZvdW5kOiAnICsgcHJpbWFyeUtleSArICcsJyArIGtleSArICdhbmQgcG9zc2libHkgb3RoZXJzLiBPcmlnaW5hbCBtZXNzYWdlXFxuJyAgKyBKU09OLnN0cmluZ2lmeSAobXNnT2IpO1xuXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgKHByaW1hcnlLZXkgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIH0gLy8gZW5kIGlmICh2LnNlY29uZGFyeS5oYXNPd25Qcm9wZXJ0eSAoa2V5KSlcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9IC8vIGVuZCBpZiAocHJpbWFyeUNhbmRpZGF0ZXNBLmxlbmd0aCA9PT0gMClcblxuICAgIGlmIChwcmltYXJ5S2V5ID09PSBudWxsKSB7XG5cbiAgICAgICAgcmVzLmVyciA9ICdnby1tc2cucGFyc2VNc2c6IEVpdGhlciB0aGVyZSB3YXMgbm8gcHJpbWFyeSBrZXkgb3IgbXVsdGlwbGUgcHJpbWFyeSBjYW5kaWRhdGVzIGFyZSBtZW1iZXJzIG9mIHNlY29uZGFyeTogJyArIEpTT04uc3RyaW5naWZ5IChwcmltYXJ5Q2FuZGlkYXRlc0EpO1xuXG4gICAgfSAvLyBlbmQgaWYgKHByaW1hcnlLZXkgPT09IG51bGwpXG4gICAgXG5cblxuICAgIHJlcy5wID0gcHJpbWFyeUtleTtcbiAgICByZXMuYyA9IHByaW1hcnlLZXkgJiYgdi5wcmltYXJ5IFtwcmltYXJ5S2V5XSAhPT0gMCA/IG1zZ09iIFtwcmltYXJ5S2V5XSA6IG51bGw7XG4gICAgICAgIC8vIGV4YW1wbGUgdm9pZCBodG1sIHRhZyBoYXMgemVybyBjb250ZW50LCBzbyBjb250ZW50IGlzIGZvcmNlZCB0byBudWxsXG5cbiAgICByZXMucyA9IGF0dHJzT2I7XG4gICAgcmVzLm0gPSBtZXRhT2I7XG5cbiAgICByZXR1cm4gcmVzO1xuXG59OyAvLyBlbmQgZi5wYXJzZU1zZyBcblxuXG5cbmNvbnN0IFAgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAucGFyc2VNc2cgPSAobXNnT2IpID0+IHtcbiAgICBcbiAgICBjb25zdCByZXMgPSBmLnBhcnNlTXNnIChtc2dPYik7XG5cbiAgICBhY3Rpb24gPSB2LnByaW1hcnkgW3Jlcy5wXTtcbiAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXG4gICAgICAgIGFjdGlvbiAocmVzKTtcblxuICAgIH0gLy8gZW5kIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBcblxuICAgIHJldHVybiByZXM7XG5cbn07IC8vIGVuZCBQLnBhcnNlTXNnIFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLnByaW1hcnlLZXlHZXQgPSAobXNnT2IpID0+IHtcbiAgICBcbiAgICBjb25zdCByZXMgPSBmLnBhcnNlTXNnIChtc2dPYik7XG4gICAgcmV0dXJuIHJlcy5wO1xuXG59OyAvLyBlbmQgUC5wcmltYXJ5S2V5R2V0IFxuXG5cbkEuaW5pdCAoKTtcblxucmV0dXJuIFA7XG5cbn07XG5cblxuXG4iLCJcbi8vIHJtVGFiLmpzIChnby14MilcblxuLy8gaW5zZXJ0cyBhbiAnWCcgaW50byB1cHBlciByaWdodCBcbi8vIGNvcm5lciBvZiBwYXJlbnQgaW4gb3JkZXIgdG8gcmVtb3ZlIHBhcmVudCB3aGVuIGNsaWNrZWRcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocDApIHtcblxuY29uc3QgdiA9IHtcbiAgICBqcVNlbDogcDAuanFTZWwsXG4gICAgZHBwOiBwMC5kcHAsXG4gICAgZGVsZXRlQ2I6IHAwLmRlbGV0ZUNiID8gcDAuZGVsZXRlQ2IgOiBudWxsLFxuICAgIHNob3dYOiBwMC5zaG93WCA/IHAwLnNob3dYIDogbnVsbCxcblxuICAgIElkWDogbnVsbCxcbn07XG5cbmNvbnN0IEE9e307XG5cbkEuaW5pdCA9ICgpID0+IHtcblxuICAgICAgICAvLyB2LmRwcCAoe3RleHQ6ICdJTklUWEF1dG9UUy4uLicsIHByZXBlbmQ6ICdib2R5J30pO1xuICAgIGNvbnN0IHZpc2liaWxpdHkgPSB2LnNob3dYID8gJ3Zpc2libGUnIDogJ2hpZGRlbic7XG5cbiAgICAgICAgLy8gLS0tLSAgY2xpY2tlZCAtLS0tXG4gICAgY29uc3QgY2xpY2tlZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAodi5kZWxldGVDYiA9PT0gbnVsbCkge1xuXG4gICAgICAgICAgICAkKHYuanFTZWwpXG4gICAgICAgICAgICAucmVtb3ZlICgpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHYuZGVsZXRlQ2IgKHYuanFTZWwpO1xuXG4gICAgICAgIH0gLy8gZW5kIGlmICh2LmRlbGV0ZUNiID09PSBudWxsKVxuICAgICAgICBcbiAgICB9OyAgLy8gZW5kIGNsaWNrZWRcblxuXG4gICAgY29uc3QgWCA9IHtcbiAgICAgICAgc3BhbjogJ1gnLFxuICAgICAgICBwYXJlbnQ6IHYuanFTZWwsXG4gICAgICAgIHN0eWxlOiBgXG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxuICAgICAgICAgICAgdG9wOiAtM3B4OyBcbiAgICAgICAgICAgIHJpZ2h0OiAtM3B4O1xuICAgICAgICAgICAgdmlzaWJpbGl0eTogJHt2aXNpYmlsaXR5fTtgLFxuICAgICAgICBoaW46IGZ1bmN0aW9uIChJZCkge1xuXG4gICAgICAgICAgICAkKElkKS5jc3MgKHtjdXJzb3I6ICdjZWxsJ30pO1xuICAgICAgICB9LFxuICAgICAgICBjbGs6IGZ1bmN0aW9uIChJZCkge1xuXG4gICAgICAgICAgICBjbGlja2VkICgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIHNhbWUgYXMgcHJldmVudERlZmF1bHQgYW5kIHN0b3BQcm9wYWdhdGlvbixcbiAgICAgICAgICAgICAgICAvLyBidXQgd2lsbCBub3Qgc3RvcCBpbW1lZGlhdGUgcHJvcGFnYXRpb24gKG90aGVyXG4gICAgICAgICAgICAgICAgLy8gY2xpY2sgaGFuZGxlcnMgb24gdGhlIHNhbWUgZWxlbWVudClcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgdi5JZFggPSB2LmRwcCAoWCk7XG5cbiAgICAgICAgLy8gZm9yIG1vYmlsZSBkZXZpY2VzOiBhcHBhcmVudGx5IGNsaWNrcyBvbiBcbiAgICAgICAgLy8gYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnRzIGFyZW4ndCByZWNvZ25pemVkLlxuICAgICQodi5JZFgpXG4gICAgLm9uICgndG91Y2hlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICBjbGlja2VkICgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjdXJQb3MgPSAkKHYuanFTZWwpLmNzcyAoJ3Bvc2l0aW9uJyk7XG4gICAgaWYgKGN1clBvcyAhPT0gJ2Fic29sdXRlJykge1xuXG4gICAgICAgICQodi5qcVNlbClcbiAgICAgICAgLmNzcyAoe1xuICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIH0pO1xuXG4gICAgfSAvLyBlbmQgaWYgKGN1clBvcyAhPT0gJ2Fic29sdXRlJylcbiAgICBcbiAgICBjb25zdCBzZWxFdnRzID0ge1xuICAgICAgICBzZWw6IHYuanFTZWwsXG4gICAgICAgIGhpbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh2LklkWClcbiAgICAgICAgICAgIC5jc3MgKHt2aXNpYmlsaXR5OiAndmlzaWJsZSd9KTtcbiAgICAgICAgfSxcbiAgICAgICAgaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHYuSWRYKVxuICAgICAgICAgICAgLmNzcyAoe3Zpc2liaWxpdHk6ICdoaWRkZW4nfSk7XG4gICAgICAgIH0sXG4vLyAgICAgICAgZGNsazogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAvLyBmb3IgdGhlIGJlbmVmaXQgb2YgbW9iaWxlIHVzZXJzIGhhdmluZyBubyBob3ZlciBmblxuLy8gICAgXG4vLyAgICAgICAgICAgIGNvbnN0IHZTdGF0ID0gJCh2LklkWCkuY3NzICgndmlzaWJpbGl0eScpO1xuLy8gICAgICAgICAgICBjb25zdCBuZXdTdGF0ID0gdlN0YXQgPT09ICd2aXNpYmxlJyA/ICdoaWRkZW4nIDogJ3Zpc2libGUnO1xuLy8gICAgXG4vLyAgICAgICAgICAgICQodi5JZFgpXG4vLyAgICAgICAgICAgIC5jc3MgKHt2aXNpYmlsaXR5OiBuZXdTdGF0fSk7XG4vLyAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgdi5kcHAgKHNlbEV2dHMpO1xuXG59OyAgLy8gZW5kIEEuaW5pdFxuXG5jb25zdCBQID0ge307XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLnhSbSA9ICgpID0+IHtcbiAgICBcbiAgICAkKHYuSWRYKS5yZW1vdmUgKCk7XG5cbn07IC8vIGVuZCBQLnhSbVxuXG5cblxuXG5BLmluaXQgKCk7XG5cbnJldHVybiBQO1xuXG59O1xuXG5cblxuIl19
