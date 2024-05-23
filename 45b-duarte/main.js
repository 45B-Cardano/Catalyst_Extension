let keyphrases = [
    "What is the problem",
    "Summarize your solution",
    "Describe your proposed solution"
]


let list = document.querySelector('#list');
for (const phrase of keyphrases) {
    const li = document.createElement("li");
    const textnode = document.createTextNode(phrase);
    li.appendChild(textnode);
    list.appendChild(li);
}

document.getElementById('read-content').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        
        function printTitle() {
            // TODO:  ver: porque não consegui ter acesso à lista neste contexto?
            let keyphrases = [
                "What is the problem",
                "Summarize your solution",
                "Describe your proposed solution"
            ]
            // podia ser feito a partir de uma lista mais concisa 
            // (ex: apenas os que têm um mínimo de length, ou dentro de um elemento específico)
            const matches = Array.from(document.querySelectorAll('h2'))
            .filter(x => keyphrases.find(k=> x.innerText.includes(k)) ).map(x => x.innerText); // para cada h2, vê se tem uma das keyphrases
            var result = matches;
            
            // https://developer.chrome.com/docs/extensions/mv3/messaging/
            (async () => {
                const response = await chrome.runtime.sendMessage({info: result});
                // do something with response here, not outside the function
                console.log(response);
            })();
            
            //return resultStr;
        };

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: printTitle,
            //        files: ['contentScript.js'],  // To call external file instead
        }).then(() => console.log('Injected a function!'));
    });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script: " + sender.tab.url :
                "from the extension");
    var resp = request.info;
    if (resp) {
        var resultElement = document.getElementById("list");
        var listItems = Array.from(resultElement.children);
        
        // TODO: fazer mais elegante
        for (const item of listItems) {
            if(resp.find(r => r.includes(item.innerText))){
                item.style="background-color:lightblue;"
            }else{
                item.style="";
            }
        }
        sendResponse({response: "resposta bem sucedida!"});
    }
  }
);