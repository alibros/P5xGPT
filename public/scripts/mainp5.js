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
