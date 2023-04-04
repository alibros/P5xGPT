var editor = ace.edit("code");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
fetch('/scripts/sketch.js')
.then(response => response.text())
.then(text => {
    
    editor.setValue(text, -1);
})
.catch(error => {
    console.error('Error fetching the file:', error);
});

// Add a custom command for sending the modified code to the server
editor.commands.addCommand({
  name: "save",
  bindKey: {win: "Ctrl-S", mac: "Command-S"},
  exec: function(editor) {
    // Get the modified code
    var code = editor.getValue();
    // Send the code to the server using fetch()
    fetch('/update-p5code', {
      method: 'POST',
      body: JSON.stringify({code: code}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Code saved successfully:', response);
      window.location.reload();
    })
    .catch(error => {
      console.error('Error saving the code:', error);
    });
  }
});

// Create a toolbar button for the custom command
editor.commands.bindKey("Ctrl-S", function() {
  editor.execCommand("save");
}, "save");

// Add the toolbar button to the DOM
var saveButton = document.getElementById("save-button");

// Bind the button click event to the save command
var saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", function() {
  editor.execCommand("save");
});
