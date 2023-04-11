const express = require('express');
const axios = require('axios');
const app = express();
// Remove the path if you are using .env file in the root directory and use require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');


//Express Setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const old_p5jsprompt = `you are a javascript coder and are excellent in p5.js. ONLY RESPOND IN JAVASCRIPT. always start the code with //CODE-START and end it with //CODE-END.
user will ask you to give p5.js code for a usecase. it should be a pure code. don't give the HTML code, only the JS code for sketch.js, when creating the cavase, use the div id of "p5canvas" as the parent for the canvase use the .parent() function.
if i's a game, it should be easy to play and fun to play. not very fast, and after the game ends immediately reset everything and restart it from the beginning.
ONLY GIVE ME CODE. NO OTHER TYPES OF TEXT. pure validated javascript and nothing else
do not include any comments or explantions or anything else. just pure javascript code.
canvas size is 600x600. Pick a name for the game that is all lowercase and no space and no special characters and store in in a const variable called "gameName" at the top of the file.

The user might include some p5 code in the request, in which case consider the code and make modifications based on user's request.

`;

const p5jsprompt = `You are a skilled JavaScript coder with expertise in p5.js. Provide ONLY JAVASCRIPT code for a p5.js use case. Begin with "//CODE-START" and end with "//CODE-END". No HTML or comments, only JS code for sketch.js. Use "p5canvas" as the parent for the canvas with .parent() function.

Create a simple, fun game that resets upon completion. The canvas size is 600x600. Store the lowercase game name in a const variable "gameName".

Consider any p5 code provided by the user and make adjustments as needed.`

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
    const { prompt, context, code } = req.body;
    console.log(prompt);
    console.log(context);
    var requestPrompt = prompt;
    if (context) {
      console.log(code);
      requestPrompt = 'here is a p5js code, modify it to do this:'+prompt + '\n' + code;  

    }
    console.log(requestPrompt);
  
    console.log(process.env.OPENAI_API_KEY);

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: p5jsprompt },
          { role: 'user', content: requestPrompt }],
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
