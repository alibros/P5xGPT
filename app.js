const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config({ path: '.env.local' });
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');


//Express Setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const p5jsprompt = `you are a javascript coder and are excellent in p5.js. ONLY RESPOND IN JAVASCRIPT. always start the code with //CODE-START and end it with //CODE-END.
user will ask you to give p5.js code for a usecase. it should be a pure code. don't give the HTML code, only the JS code for sketch.js, when creating the cavase, use the div id of "p5canvas" as the parent for the canvase use the .parent() function.
if i's a game, it should be easy to play and fun to play. not very fast, and after the game ends immediately reset everything and restart it from the beginning.
ONLY GIVE ME CODE. NO OTHER TYPES OF TEXT. pure validated javascript and nothing else
do not include any comments or explantions or anything else. just pure javascript code.
canvas size is 600x600.
`;

//Main endpoint
app.get('/', (req, res) => {    
  res.render('index');
});

//Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// End Point to generate P5 Code from GPT
app.post('/generate-p5code', async (req, res) => {
    const prompt = req.body.prompt;
    console.log(prompt);
  
    console.log(process.env.OPENAI_API_KEY);

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: p5jsprompt },
          { role: 'user', content: prompt }],
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 
          },
        })
        
      const generatedCode = response.data.choices[0].message.content.trim();
      const cleanCode = getCodeFromGPTOutput(generatedCode);
      await saveP5CodeToFile(cleanCode, "sketch");
      res.json({ code: cleanCode, prompt: prompt });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate P5 code.' });
    }
});



app.post('/update-p5code', async (req, res) => {
    const code = req.body.code;
    try{
        await saveP5CodeToFile(code, "sketch");
        res.send('Code saved successfully');
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to save P5 code.' });
    }
});

function saveP5CodeToFile(code, name) {
    const filePath = path.join(__dirname, 'public/scripts', `${name}.js`);
    const fileContent = code;
    // Create the file if it doesn't exist
    if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, fileContent);
    }
    // Update the file content
    fs.writeFileSync(filePath, fileContent);
}


//Clean the string output from GPT to make it valid P5 Code
function getCodeFromGPTOutput(str) {
    const start = '//CODE-START';
    const end = '//CODE-END';
    const startIndex = str.indexOf(start);
    const endIndex = str.indexOf(end);
  
    if (startIndex === -1 || endIndex === -1) {
      return '';
    }
  
    return str.substring(startIndex + start.length, endIndex).trim();
  }
