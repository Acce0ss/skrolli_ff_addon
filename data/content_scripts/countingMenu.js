var wordToCount = document.getElementById("keyword");
var pageModCheckbox = document.getElementById("enable");
var countButton = document.getElementById("countButton");

countButton.disabled = true;

pageModCheckbox.addEventListener('change', function(){

  self.port.emit('pagemod-enabled-changed', pageModCheckbox.checked);
});

wordToCount.addEventListener('input', function(){

  countButton.disabled = (wordToCount.value.length <= 0);  
});

countButton.addEventListener('click', function(){

  self.port.emit('count-requested', wordToCount.value);
});
