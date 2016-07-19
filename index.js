var pageMod = require("sdk/page-mod");

var ui = require("sdk/ui");
var tabs = require("sdk/tabs");
var panels = require("sdk/panel");

var menuButton = ui.ToggleButton(
{
  id: "menutoggle",
  label: "Show counting menu",
  icon: {
    "16":"./s-icon.png",
    "32":"./s-icon.png",
    "64":"./s-icon.png"
  },
  onChange: handleChange
});

function handleChange(state) {
  if (state.checked) {
    countingMenu.show({
      position: menuButton
    });
  }
}

var countingMenu = panels.Panel({
  contentURL: "./content_html/countingMenu.html",
  contentScriptFile: "./content_scripts/countingMenu.js",
  onHide: handleHide
});

function handleHide(){
  menuButton.state('window', {checked: false});
}

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
	worker.port.emit('count-words', '[S]krolli');
      }
    });
  }
  else
  {
    skrolliPageMod.destroy();
  }
});

