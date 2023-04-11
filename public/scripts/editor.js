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
  name: "update",
  bindKey: {win: "Ctrl-S", mac: "Command-S"},
  exec: function(editor) {
    // Get the modified code
    var code = editor.getValue();
    console.log("code to update:", code)
    // Send the code to the server using fetch()
    fetch('/update-p5code', {
      method: 'POST',
      body: JSON.stringify({code: code}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Code updated successfully:', response);
      window.location.reload();
    })
    .catch(error => {
      console.error('Error saving the code:', error);
    });
  }
});

// Create a toolbar button for the custom command
editor.commands.bindKey("Ctrl-S", function() {
  editor.execCommand("update");
}, "update");

// Add the toolbar button to the DOM
var updateButton = document.getElementById("update-button");


// Bind the button click event to the update command
var updateButton = document.getElementById("update-button");
updateButton.addEventListener("click", function() {
  editor.execCommand("update");
});


// Add a custom command for saving the modified code as a new file
editor.commands.addCommand({
    name: "save",
    bindKey: {win: "Ctrl-Shift-S", mac: "Command-Shift-S"},
    exec: function(editor) {
      // Get the modified code
      var code = editor.getValue();
      console.log("code to save:", code)
      // Send the code to the server using fetch()
      fetch('/save-p5code', {
        method: 'POST',
        body: JSON.stringify({code: code}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Code saved successfully:', response);
        alert('Code saved successfully.');
      })
      .catch(error => {
        console.error('Error saving the code:', error);
      });
    }
  });
  
  // Bind the custom command to the new "Save" button
  var saveButton = document.getElementById("save-button");
  saveButton.addEventListener("click", function() {
    editor.execCommand("save");
  });