const express = require('express')
const fs = require('fs')
const {v4:uidv4} = require('uuid')
const dotenv = require('dotenv')
dotenv.config()
const app = express()

//GET REQUEST
//must use Async since we returning a promise

app.get('/', async (req, res) => {
    try {
        const data = await fs.promises.readFile('./data.json', { encoding: 'utf-8' });
        const json_data = JSON.parse(data);

        res.status(200).json({ response: json_data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//POST REQUEST
app.post('/',(req,res)=>{
    //object
    const data = {
        "device_id":uidv4(),
        "temp": parseFloat((Math.random()*(40-6.1)+6.1).toFixed(1))//e.g. 12.4
    }

    writeToFile('data.json',data)
    //code block for what this endpoint processes and returns as part of the GET Request
    res.status(200).json({response:data})
})

//utils function
function writeToFile(filepath,content){
   const data = fs.readFileSync(filepath,'utf-8')
   const json_data = JSON.parse(data)

   //append to existing file - data.json
   json_data.temp_reading.push(content)
   //write to file
   fs.writeFileSync(filepath, JSON.stringify(json_data,null,2), 'utf-8')
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, (e) => console.log(`Server listening on PORT ${PORT}...`))