const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let itens = [
    { id: 1, name: "Engenharia de Software"}, 
    { id: 2, name: "Sistemas de Informação"},
];

app.get('/itens', (req, res) => {
    res.status(200).json(itens);
});

app.post('/itens', (req, res) => {
    const newItem = { id: itens.length + 1, name: req.body.name}
    itens.push(newItem);
    res.status(200).json(newItem);
});

app.listen(port, () => {
    console.log(`O servidor está executando em: http//:localhost:${port}`);
})
