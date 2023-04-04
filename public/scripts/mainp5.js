const p5Form = document.getElementById('prompt-form');
const loadingSpinner = document.getElementById('loading-spinner');

p5Form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = document.getElementById('prompt').value;

  try {
    loadingSpinner.style.display = 'block';
    const response = await fetch('/generate-p5code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
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
