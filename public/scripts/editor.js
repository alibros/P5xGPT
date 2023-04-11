var editor = ace.edit("code");
editor.setTheme("ace/theme/monokai");

document.addEventListener("DOMContentLoaded", function () {
    let style = document.createElement("style");
    style.type = "text/css";
    style.textContent = `
    .ace_scrollbar-v::-webkit-scrollbar,
    .ace_scrollbar-h::-webkit-scrollbar {
      background-color: transparent;
    }
    
    .ace_scrollbar-v::-webkit-scrollbar-thumb,
    .ace_scrollbar-h::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
    }
    `;
    document.head.appendChild(style);
  });


editor.session.setMode("ace/mode/javascript");
fetch('/scripts/sketch.js')
.then(response => response.text())
.then(text => {
    
    editor.setValue(text, -1);
    var gameNameDisplay = document.getElementById("game-name-display");
    gameNameDisplay.textContent = `${getGameName(text)}`;

    var gameInstructionsDisplay = document.getElementById("game-instructions");
    gameInstructionsDisplay.textContent = `${getGameInstructions(text)}`;
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
        location.reload();
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


  function getGameName(code) {
    const gameNameRegex = /(?:const|let|var)\s+gameName\s*=\s*['"]([^'"]+)['"]/;
    const match = code.match(gameNameRegex);
  
    if (match && match[1]) {
      return match[1];
    } else {
      return "";
    }
  }



  function getGameInstructions(code) {
    const gameNameRegex = /(?:const|let|var)\s+gameInstructions\s*=\s*['"]([^'"]+)['"]/;
    const match = code.match(gameNameRegex);
  
    if (match && match[1]) {
      return match[1];
    } else {
      return "";
    }
  }