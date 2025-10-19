// CABEÇALHO

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());


let items = [
    { id: 1, name: "Engenharia de Software"},
    { id: 2, name: "Sistemas de Informação"},
];

app.listen(port, () => {
    console.log(`O servidor está rodando em http://localhost:${port}`);
})




// ---------------------------------- QUESTAO 1 -----------------------------------

// 1. Explique o papel do protocolo HTTP no funcionamento das APIs REST. 
// Mencione métodos, status codes e a natureza stateless do protocolo. 

// R: O HTTP é a base da comunicacao entre clientes e servidores com API REST. é atraves dele que são definidas 
// como as mensagens sao enviadas e recebidas. o protocolo HTTP possui varios metodos:

// GET	    Ler as informações de um recurso.
// POST	    Criar um novo recurso.
// PUT	    Atualizar um recurso inteiro.
// PATCH	Atualizar parcialmente um recurso.
// DELETE	Remover um recurso.

// para indicar o resultado de uma acao HTTP, sao definidos alguns codigos:

// 200	    Sucesso .
// 201	    Recurso criado com sucesso (Created).
// 400	    Requisição inválida (Bad Request).
// 404	    Recurso não encontrado (not found).
// 422	    Entidade não processável (Unprocessable Entity).
// 500	    Erro interno no servidor.

// natureza stateless (sem estado):

// O protocolo HTTP nao guarda informacoes de uma requisicao para outra, ou seja, o servidor nao mantem historico de uma requisicao para outra

// ---------------------------------- QUESTAO 2 -----------------------------------

// 2. Implemente um novo endpoint GET /item/:id que retorne um item 
// específico pelo seu id. 
// Exemplo: /item/2 deve retornar { id: 2, name: "Sistemas de Informação" }.


 app.get('/item/:id', (req, res) => {
     const id = parseInt(req.params.id);
     const index = items.findIndex(item => item.id === id);
     if (index !== -1) {
         const item = items[index]
         res.status(200).json(item);
     }
     else {
        res.status(404).json({message: "Item não encontrado!"});
     }
});  


// ---------------------------------- QUESTAO 3 -----------------------------------

// 3. Refatore a API atual para validar se o campo name existe no corpo da 
// requisição ao criar um item. Caso não exista, retorne 400 Bad Request.


app.post('/item', (req, res) => {
    const newItem = { id: items.length + 1, name: req.body.name}
    items.push(newItem);

    if (req.body.name == "") {
        res.status(400).json({message: "bad request"})
    }
    else {
        res.status(200).json({message: "concluido com sucesso"})
    }
});



// ---------------------------------- QUESTAO 4 -----------------------------------

// 4. Crie uma rota /info que retorne a quantidade total de itens e a data/hora 
// atual. 

// Exemplo de resposta: 
// { 
//   "total": 2, 
//   "timestamp": "2025-05-29T18:00:00Z" 
// }



app.get('/item/info', (req, res) => {
    const data = Date.now // pega a data atual
    const qtde = items.length // lenght é a propriedade do comprimento do array
    res.status(200).json({
        items: qtde, // passa a variavel quantidade na mensagem
        Data: new Date().toLocaleString('pt-BR') // transforma a data em formato atual do brasil, pra que nao conte os milisegundos a partir de 1970
    });
});


// ---------------------------------- QUESTAO 5 -----------------------------------


// 5. Analise o trecho do código e explique como o servidor trata a exclusão 
// de um item. Quais são os riscos de deixar a operação de remoção assim? 

// Explique como o servidor trata a exclusão de um item e discorra sobre os riscos de 
// permitir essa operação sem autenticação ou confirmação. Como isso poderia 
// afetar a integridade dos dados? 

// R: para excluir algo, primeiro precisa veririficar se esse algo existe. entao o servidor cerifica pelo id
// se existir, ele remove atraves do metodo delete, se nao existir, retorna 404 not found

// existem diveros problemas em fazer a remocao atraves desse metodo:

// 1: qualquer pessoa que má intecionada que souber a URL, pode excluir algo, ou uma exlcusao acidental.
// 2: os dados excluidos sao irreversiveis, ou seja, nao podem ser recuperados.




// ---------------------------------- QUESTAO 6 -----------------------------------

// 6. Adicione um mecanismo simples de logging que exiba no console 
// todos os endpoints acessados, o método HTTP e o horário da requisição.


// MIDDLEWARES

app.use('/user', (req, res, next) => { 
    const horario = new Date().toLocaleString('pt-BR');
    console.log(`[${horario}] ${req.method}`);
    next(); // deixa a funcao next em aberto 
}); 


// ---------------------------------- QUESTAO 7 -----------------------------------

// 7. Explique a diferença entre as APIs REST e WebSocket e dê exemplos 
// de quando cada uma seria mais indicada.

// API REST: funciona sob o protocolo HTTP, baseado em cliente-servidor, sendo stateless.
// diferentemente do SOAP, aonde os requisitos precisam ser rigorsamente cumpridos, no REST nao há obrigatoriedade.
// pode ser usada em servicos onde nao ha a necessidade de ter comunicacao em tempo real.

// R: A API WebSocket atualiza em tempo real os dados. Softwares que necessitam da atualização em tempo real utilizam essa API.
// sao utilizadas quando há necessidade de comunicacao em tempo real ou quando o servidor precisa enviar dados ao cliente sem esperar que ele pergunte.
// como exemplo da WebSocket, tem o whatsapp web, que necesssita dessa atualizção. Outros softwares tambem utilizam, como o 
// Spotify web, aonde o title da pagina do navegador é atualizado conforme a musica que esta sendo reproduzida no momento.


// ---------------------------------- QUESTAO 8 -----------------------------------

// 8. Implemente uma verificação na rota PUT para garantir que o campo 
// name não seja vazio. Caso seja, retorne 422 Unprocessable Entity. 
 
app.put('/item/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = {id, ...req.body}
        if (req.body.name == "") {
            res.status(422).json({message: "unprocessable entity"})
        }
    } else {
        res.status(404).json({ message: "Item não encontrado!"});
    }

});


// ---------------------------------- QUESTAO 9 -----------------------------------

// 9. Transforme o array de itens em um dicionário (objeto com chave pelo 
// id) e adapte todas as rotas para funcionar com essa nova estrutura. 
// Avalie o impacto em performance e explique o que é um dicionário em JS. 

let itens = {
    1: { id: 1, name: "Engenharia de Software" },
    2: { id: 2, name: "Sistemas de Informação" }
};

app.get('/itens/:id', (req, res) => {
    const id = req.params.id;
    const iten = itens[id];

    if (iten) {
        res.status(200).json(iten);
    } else {
        res.status(404).json({ message: "itens não encontrado!" });
    }
});


app.delete('/itens/:id', (req, res) => {
    const id = req.params.id;
    
    if (itens[id]) {
        delete itens[id];  
        res.status(200).json({ message: "Item removido com sucesso" });
    } else {
        res.status(404).json({ message: "Item não encontrado" });
    }
});


app.post('/itens', (req, res) => {
    const { name } = req.body;

    if (name == "") {
        return res.status(400).json({ message: "Bad Request" });
    }
    else {
        // como a propriedade length funciona apenas com arrays, a forma de adicionar segue a mesma logica, so que de outra forma

        // math.max pega o maior id que existe, e o object key acessa pega todas as chaves
        const newId = Math.max(...Object.keys(itens).map(Number)) + 1; // converte as strings para numero e adiciona +1
        const newIten = { id: newId, name: name };
        itens[newId] = newIten;
        res.status(200).json({ message: "Iten criado com sucesso"});
    }
    
});


app.put('/itens/:id', (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const verifica = itens[id];

    if (verifica == "") {
        res.status(404).json({message: "item nao encontrado"})
    } 

    if (name == "") {
        res.status(422).json({message: "unprocessable entity"})
    }
    else {
        res.status(200).json({message: "concluido com sucesso"})
    }
});

// utilizar um dicionario ao inves de um array se torna melhor devido a rapidez para a procura de dados em um banco de dados.
// em APIs pequenas, com poucos dados, nao ha diferenca, mas em em bancos de dados maiores, o array se torna mais lento.


// ---------------------------------- QUESTAO 10 -----------------------------------

// 10. Estenda a API criando um recurso /curso com os mesmos métodos 
// (GET, POST, PUT, DELETE), mas com atributos id, nome, cargaHoraria. 

let cursos = {
    1: {id: 1, nome: "engenharia de software", horaria: "4000"},
    2: {id: 2, nome: "ciencia da computação", horaria: "4000"},
};

app.get('/curso/:id', (req, res) => {
    const id = req.params.id;
    const curso = cursos[id];

    if (curso) {
        res.status(200).json(cursos);
    } else {
        res.status(404).json({ message: "itens não encontrado!" });
    }
});

app.delete('/curso/:id', (req, res) => {
    const id = req.params.id;
    
    if (cursos[id]) {
        delete cursos[id];  
        res.status(200).json({ message: "curso removido com sucesso" });
    } 
    else {
        res.status(404).json({ message: "curso não encontrado" });
    }
});


app.post('/curso', (req, res) => {
    const { nome } = req.body;
    const { horaria } = req.body;

    if (nome === "" || horaria === isNaN) {
        return res.status(400).json({ message: "Bad Request" });
    }

    else {
        // como a propriedade length funciona apenas com arrays, a forma de adicionar segue a mesma logica, so que de outra forma

        // math.max pega o maior id que existe, e o object key acessa pega todas as chaves
        const newId = Math.max(...Object.keys(itens).map(Number)) + 1; // converte as strings para numero e adiciona +1
        const newIten = { id: newId, nome: nome };
        cursos[newId] = newIten;
        res.status(201).json({ message: "Iten criado com sucesso"});
    }
});


app.put('/curso', (req, res) => {
    const id = req.params.id;
    const { curso } = req.body;
    const { horaria } = req.body;
    const verifica = cursos[id];

    if (verifica == "") {
        res.status(404).json({message: "item nao encontrado"})
    }
    
    if (curso === "" || horaria === isNaN) {
        res.status(400).json({message: "bad request"})
    }
    else {
        res.status(200).json({message: "concluido com sucesso!"})
    }
});

// ---------------------------------- QUESTAO 11 -----------------------------------

// 11. Implemente o método PATCH na rota /curso/:id para permitir 
// atualizações parciais. 
// O método PATCH deve permitir alterar apenas um ou mais atributos do curso, 
// sem a necessidade de enviar o objeto completo.


app.patch('/curso/:id', (req, res) => {
    const id = req.params.id;
    const { curso } = req.body;
    const { horaria } = req.body;
    const verifica = cursos[id];

     if (verifica == "") {
        res.status(404).json({message: "item nao encontrado"})
    }

    if (curso === "" || horaria === isNaN) {
        res.status(400).json({message: "bad request"})
    }
    else {
        res.status(200).json({message: "concluido com sucesso!"})
    }
});