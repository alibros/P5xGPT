const p5Form = document.getElementById('prompt-form');
const loadingSpinner = document.getElementById('loading-spinner');
const cleanContextCheckbox = document.getElementById('clean-context-checkbox');
const codeeditor = ace.edit('code');

p5Form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = document.getElementById('prompt').value;
  const codeContent = codeeditor.getValue();

  const requestData = { 
    prompt: prompt,
    context: !cleanContextCheckbox.checked 
  };

  if (!cleanContextCheckbox.checked) {
    requestData.code = codeContent;
  }

  try {
    loadingSpinner.style.display = 'block';
    const response = await fetch('/generate-p5code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      console.log("evaluating code");
      const { code } = await response.json();
      location.reload();
    } else {
      console.error('Failed to generate P5 code.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    loadingSpinner.style.display = 'none';
  }
});


async function fetchSavedGames() {
  try {
    const response = await fetch('/list-saved-games');
    const savedGames = await response.json();
    const savedGamesList = document.getElementById('saved-games-list');
    
    savedGames.forEach((game) => {
      const listItem = document.createElement('li');
      listItem.textContent = game.slice(0, -3); // Remove the .js extension
      listItem.addEventListener('click', () => loadGame(game));
      savedGamesList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching saved games:', error);
  }
}

async function loadGame(gameName) {
  try {
    const response = await fetch(`/savedgames/${gameName}`);
    if (response.ok) {
      const code = await response.text();
      editor.setValue(code, -1);

      // Programmatically click the "update" button after loading the saved game
      const updateButton = document.getElementById("update-button");
      updateButton.click();
    } else {
      console.error('Failed to load saved game.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchSavedGames();