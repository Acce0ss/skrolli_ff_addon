var self = require("sdk/self");

var pageMod = require("sdk/page-mod");

var ui = require("sdk/ui");
var tabs = require("sdk/tabs");
var panels = require("sdk/panel");

var filepick = require("./lib/filepicker.js");

var menuButton = ui.ToggleButton(
    {
	id: "menutoggle",
	label: "Show counting menu",
	icon: {
	    "16":"./icon-16.png",
	    "32":"./icon-32.png",
	    "64":"./icon-64.png"
	},
	onChange: handleChange
    }
);

var countingMenu = panels.Panel({

    contentURL: "./content_html/countingMenu.html",
    contentScriptFile: "./content_scripts/countingMenu.js",
    onHide: handleHide
});

countingMenu.port.on('count-requested', function(keyword){
    var countWorker = tabs.activeTab.attach({
	contentScriptFile: "./content_scripts/countall.js"
    });
    countWorker.port.emit('count-words', keyword);
});

var skrolliPageMod = null;

countingMenu.port.on('pagemod-enabled-changed', function(enabled){
    if(enabled)
    {
	skrolliPageMod = pageMod.PageMod({
	    include: '*.skrolli.fi',
	    contentScriptFile: './content_scripts/countall.js',
	    onAttach: function(worker){
		worker.port.emit('count-words', '[Ss]krolli');
	    }
	});
    }
    else
    {
	skrolliPageMod.destroy();
    }
});

function handleChange(state) {

    if (state.checked) {
	countingMenu.show({
	    position: menuButton
	});
    }
    
}

function handleHide(){
    menuButton.state('window', {checked: false});
}


