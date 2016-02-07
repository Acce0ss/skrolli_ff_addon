function getTextNodes(parent)
{
    var nodes = [];

    var walker = document.createTreeWalker(parent,
					   NodeFilter.SHOW_TEXT,
					   null,
					   false);
    var node;
    while(node=walker.nextNode())
    {
	nodes.push(node);
    }

    return nodes;
}

function countWord(word)
{
    var elements = getTextNodes(document.body);
    var count = 0;
    var matcher = new RegExp(word,'g');
    
    [].forEach.call(elements, function(e,i,l){
	count += (e.textContent.match(matcher) || []).length;
    });
    
    alert('Word "' + word + '" occurred ' + count + ' times.'); 
}

self.port.on('count-words', countWord);
