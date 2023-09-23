const express = require('express');
const app = express();
const port = 3000;
const OpenAI = require('openai');
const dotenv = require('dotenv');
const favicon = require('serve-favicon');
const path = require('path');

dotenv.config();
const secretKey = process.env.OPEN_AI_API_KEY;
const messages = [];

const openai = new OpenAI({
  apiKey: secretKey,
});

async function main(input) {
  messages.push({ role: "user", content: input });
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0]?.message?.content;
}
// TODO: Check OPENAI api and customize the responnse
// TODO: Refine the UI

app.use(express.json()); //For parsing JSON
app.use(express.urlencoded({ extended: true })); //For parsing URL encoded
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(express.static(path.join(__dirname ,'public')));

app.get('/', (req, res) => {
//   serves the index.html file
    res.sendFile(__dirname + '/templates/index.html')
})

app.post('/api', async (req, res, next) => {
    console.log(req.body);
    const mes = await main(req.body.input);
    res.json({
        success: true,
        message: mes
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})