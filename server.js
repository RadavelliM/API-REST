
const express = require('express') // Utilização do express
const app = express() // Instanciação do express
const port = 3000 // Define a porta do localhost

//Indica ao servidor que iremos trabalhar com JSON 
app.use(express.json());


//     Simula um banco de dados

let professores = [
{id: 1, name: "Roberson", periodo: "1 semestre", disciplina: "Matematica Discreta"},
{id: 2, name: "Andressa", periodo: "3 semestre", disciplina: "Desenvolvimento Web"},
{id: 3, name: "Andrei", periodo: "2 e 3 semestre", disciplina: "Banco de Dados"},
{id: 4, name: "Lucia", periodo: "5 e 6 semestre", disciplina: "Rede de Computadores"},
{id: 5, name: "Marcos", periodo: "3 e 4 semestre", disciplina: "Algoritmo"},
];

let cursos = [
{ id: 1, name: "Engenharia de Software", CargaHoraria: "4000", Universidade: "Univille"},
{ id: 2, name: "Sistemas de Informação", CargaHoraria: "4000", Universidade: "USP"},
{ id: 3, name: "Psicologia", CargaHoraria: "3500", Universidade: "UFSC"},
{ id: 4, name: "Educação Física", CargaHoraria: "4000", Universidade: "Univille"},
{ id: 5, name: "Engenharia Química", CargaHoraria: "4500", Universidade: "UDESC"},
];

let alunos = [ // 
{ id: 1, name: "Lucas", email: "lucas@gmail.com", matricula: "2983428374", telefone: "5566-7788"},
{ id: 2, name: "Henrique", email: "henrique@gmail.com", matricula: "2342347267", telefone: "1234-5678"},
{ id: 3, name: "Marcelo", email: "marcelo@gmail.com", matricula: "3284237843", telefone: "5678-1234"},
{ id: 4, name: "Camilli", email: "camilli@gmail.com", matricula: "7394237642", telefone: "1122-3344"},
{ id: 5, name: "Gustavo", email: "gustavo@gmail.com", matricula: "9834826344", telefone: "4002-8922"},
];


// A ORDEM DOS ENDPOINTS ESTA NA ORDEM DOS BANCOS DE DADOS


// GPS DE ITENS DO ENDPOINT DE PROFESSORES
function linkprofessores(prof) {    
return {
    self: { href: `/professores/${prof.id}`}, // link para o próprio item
    update: { href: `/professores/${prof.id}`, method: "PUT"}, // link para atualizar o item
    delete: { href: `/professores/${prof.id}`, method: "DELETE"}, // link para deletar o item
    post: {href: `/professores`, method: "POST"}, // link para criar um novo item
    patch: {href: `/professores/${prof.id}`, method: "PATCH"} // link para fazer atualizações parciais
}
};

// ENDPOINT DO BANCO DE DADOS PROFESSORES (GET ALL)
app.get('/professores', (req, res) => { //app.get é o verbo HTTP GET, que é usado para buscar dados
const response = professores.map(prof => ({ // percorre o vetor de professores e cria um novo vetor com os dados    
    ...prof,
    link: linkprofessores(prof), // adiciona o link de cada professor
}));
res.status(200).json(response); // // retorna o vetor de professores com status 200 (OK)
});


// Endpoint para buscar um item específico pelo ID, método GET
app.get('/professores/:id', (req, res) => { // app.get é o verbo HTTP GET, que é usado para buscar dados
const id = parseInt(req.params.id); // pega o id da URL e converte para inteiro
const prof = professores.find(prof => prof.id === id); // procura o professor pelo id

if (prof) {

    const response = professores.map(prof => ({ // percorre o vetor de professores e cria um novo vetor com os dados
    ...prof,
    link: linkprofessores(prof),
}));

    res.status(200).json(response[id - 1]); // retorna o professor encontrado com status 200 (OK)
} else {
    res.status(404).json({ message: "Item não encontrado" }); // se o professor não for encontrado, retorna status 404 (Not Found) com uma mensagem de erro
}
});

// Endpoint para adicionar um novo item, método POST
app.post('/professores', (req, res) => { 

if (!req.body.name) {
    return res.status(422).json({ message: "O campo 'name' não pode ser vazio." }); //Validação para garantir que o campo 'name' não seja vazio
}
else if (!req.body.periodo) {
    return res.status(422).json({ message: "O campo 'periodo' não pode ser vazio." }); //Validação para garantir que o campo 'periodo' não seja vazio
}
else if (!req.body.disciplina ) {
    return res.status(422).json({ message: "O campo 'disciplina' não pode ser vazio." }); //Validação para garantir que o campo 'disciplina' não seja vazio
}
//os arrays tem uma propriedade chamada length... essa propriedade calcula o tamanho
// do meu vetor e retorna ele em formato de inteiro...
const newItem = { id: professores.length + 1, ...req.body}
//push insere um novo item no vetor...
professores.push(newItem);
res.status(201).json(newItem); // retorna o novo professor criado com status 201 (Created)
});


//Endpoint para apagar um item, método DELETE
app.delete('/professores/:id', (req, res) => { 
const id = parseInt(req.params.id);
const index = professores.findIndex(prof => prof.id === id); // procura o professor pelo id
if(index !== -1) { // se o professor for encontrado
    professores.splice(index, 1); // remove o professor do vetor
    res.status(200).json({mensage: "Item removido!"}); // retorna uma mensagem de sucesso com status 200 (OK)
} else {
    res.status(404).json({mensage: "Item não encontrado"}); // se o professor não for encontrado, retorna status 404 (Not Found) com uma mensagem de erro
}
});

//Endpoint para atualizar itens da lista, método PUT
app.put('/professores/:id', (req, res) => { 
const id = parseInt(req.params.id); // pega o id da URL e converte para inteiro
const index = professores.findIndex(prof => prof.id === id); // procura o professor pelo id

if (!req.body.name || req.body.name.trim() === "") { // Validação para garantir que o campo 'name' não seja vazio
    return res.status(422).json({ message: "O campo 'name' não pode ser vazio." }); // se o campo 'name' for vazio, retorna status 422 (Unprocessable Entity) com uma mensagem de erro
}
else if (!req.body.periodo || req.body.periodo.trim() === "") { // Validação para garantir que o campo 'periodo' não seja vazio
    return res.status(422).json({ message: "O campo 'periodo' não pode ser vazio." }); // se o campo 'periodo' for vazio, retorna status 422 (Unprocessable Entity) com uma mensagem de erro
}
else if (!req.body.disciplina || req.body.disciplina.trim() === "") { // Validação para garantir que o campo 'disciplina' não seja vazio
    return res.status(422).json({ message: "O campo 'disciplina' não pode ser vazio." }); // se o campo 'disciplina' for vazio, retorna status 422 (Unprocessable Entity) com uma mensagem de erro
}

if (index !== -1) { // se o professor for encontrado
    professores[index] = {id, ...req.body} // atualiza o professor com os novos dados
    res.status(200).json(professores[index]); // retorna o professor atualizado com status 200 (OK)
} else { // se o professor não for encontrado
    res.status(404).json({ message: "Item não encontrado!"}); // retorna status 404 (Not Found) com uma mensagem de erro
}

});

//Endpoint para fazer atualizações parciais, método PATCH
app.patch('/professores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (professores[id - 1]) {
        // Atualiza apenas os campos enviados no body
        professores[id - 1] = { ...professores[id - 1], ...req.body};
        res.status(200).json(professores[id - 1]); // retorna o professor atulizado com status 200 (OK)
    } else {
        res.status(404).json({ message: "Item não encontrado!" }); // retorna erro 404 (item não encontrado), se o professor não for encontrado
    }
});













// GPS DE ITENS DO ENDPOINT DE CURSOS
function linkcurso(curso) { // Função que cria links para os cursos
return {
    self: { href: `/curso/${curso.id}`}, // link para o próprio curso
    update: { href: `/curso/${curso.id}`, method: "PUT"}, // link para atualizar o curso
    delete: { href: `/curso/${curso.id}`, method: "DELETE"}, // link para deletar o curso
    post: {href: `/curso`, method: "POST"}, // link para criar um novo curso
    patch: {href: `/curso/${curso.id}`, method: "PATCH"} // link para fazer atualizações parciais
}
};

// ENDPOINT DO BANCO DE DADOS CURSOS (GET ALL)
app.get('/curso', (req, res) => { // app.get é o verbo HTTP GET, que é usado para buscar dados
const response = cursos.map(curso => ({ // percorre o vetor de cursos e cria um novo vetor com os dados
    ...curso,
    link: linkcurso(curso), // adiciona o link de cada curso
}));
res.status(200).json(response); // retorna o vetor de cursos com status 200 (OK)
});

// Endpoint para buscar um item específico pelo ID, método GET
app.get('/curso/:id', (req, res) => { // app.get é o verbo HTTP GET, que é usado para buscar dados
const id = parseInt(req.params.id); // pega o id da URL e converte para inteiro
const curso = cursos.find(curso => curso.id === id); // procura o curso pelo id

if (curso) { 

    const response = cursos.map(curso => ({ // percorre o vetor de cursos e cria um novo vetor com os dados
    ...curso, 
    link: linkcurso(curso), // adiciona o link de cada curso
}));

    res.status(200).json(response[id - 1]); // retorna o curso encontrado com status 200 (OK)
} else {
    res.status(404).json({ message: "Item não encontrado" }); // se o curso não for encontrado, retorna status 404 (Not Found) com uma mensagem de erro
}
});

// Endpoint para adicionar um novo item, método POST
app.post('/curso', (req, res) => {

if (!req.body.name) { //req.body é o corpo da requisição, que contém os dados enviados pelo cliente .nmae é o nome do curso
    return res.status(422).json({ message: "O campo 'name' não pode ser vazio." }); // se o campo 'name' for vazio, retorna status 422 (Unprocessable Entity) com uma mensagem de erro
}
else if (!req.body.CargaHoraria) { 
    return res.status(422).json({ message: "O campo 'CargaHoraria' não pode ser vazio." }); // se o campo 'CargaHoraria' for vazio, retorna status 422 (Unprocessable Entity) com uma mensagem de erro
}
else if (!req.body.Universidade ) {
    return res.status(422).json({ message: "O campo 'Universidade' não pode ser vazio." }); // se o campo 'Universidade' for vazio, retorna status 422 (Unprocessable Entity) com uma mensagem de erro
}
//os arrays tem uma propriedade chamada length... essa propriedade calcula o tamanho
//do meu vetor e retorna ele em formato de inteiro...
const newItem = { id: cursos.length + 1, ...req.body}
//push insere um novo item no vetor...
cursos.push(newItem);
res.status(201).json(newItem); // retorna o novo curso criado com status 201 (Created)
});

//Endpoint para apagar um item, método DELETE
app.delete('/curso/:id', (req, res) => {
const id = parseInt(req.params.id);
const index = cursos.findIndex(curso => curso.id === id);  // procura o curso pelo id
if(index !== -1) { // (!== -1 significa que o curso foi encontrado)
    //desafio remover o item do array
    cursos.splice(index, 1); // remove o curso do vetor
    res.status(200).json({mensage: "Item removido!"}); // retorna uma mensagem de sucesso com status 200 (OK)
} else {
    res.status(404).json({mensage: "Item não encontrado"}); // se o curso não for encontrado, retorna status 404 (Not Found) com uma mensagem de erro
}
});

//Endpoint para atualizar itens da lista, método PUT
app.put('/curso/:id', (req, res) => {
const id = parseInt(req.params.id);
const index = cursos.findIndex(curso => curso.id === id); 
if (!req.body.name || req.body.name.trim() === "") { // !req.body.name || req.body.name.trim() === "" verifica se o campo 'name' é vazio
    return res.status(422).json({ message: "O campo 'name' não pode ser vazio." }); // se o campo 'name' for vazio, retorna status 422 (Unprocessable Entity) com uma mensagem de erro
}
else if (!req.body.CargaHoraria || req.body.CargaHoraria.trim() === "") { // !req.body.CargaHoraria || req.body.CargaHoraria.trim() === "" verifica se o campo 'CargaHoraria' é vazio
    return res.status(422).json({ message: "O campo 'CargaHoraria' não pode ser vazio." }); // se o campo 'CargaHoraria' for vazio, retorna status 422 (Unprocessable Entity) com uma mensagem de erro
}
else if (!req.body.Universidade || req.body.Universidade.trim() === "") { // !req.body.Universidade || req.body.Universidade.trim() === "" verifica se o campo 'Universidade' é vazio
    return res.status(422).json({ message: "O campo 'Universidade' não pode ser vazio." }); // se o campo 'Universidade' for vazio, retorna status 422 (Unprocessable Entity) com uma mensagem de erro
}

if (index !== -1) {  // se o curso for encontrado
    cursos[index] = {id, ...req.body} // atualiza o curso com os novos dados
    res.status(200).json(cursos[index]); // retorna o curso atualizado com status 200 (OK)
} else {
    res.status(404).json({ message: "Item não encontrado!"}); // se o curso não for encontrado, retorna status 404 (Not Found) com uma mensagem de erro
}

});

//Endpoint para fazer atualizações parciais, método PATCH
app.patch('/curso/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (cursos[id - 1]) {
        // Atualiza apenas os campos enviados no body
        cursos[id - 1] = { ...cursos[id - 1], ...req.body};
        res.status(200).json(cursos[id - 1]); // retorna o curso atulizado com status 200 (OK)
    } else {
        res.status(404).json({ message: "Item não encontrado!" }); // retorna erro 404 (item não encontrado), se o curso não for encontrado
    }
});












// GPS DE ITENS DO ENDPOINT DE ALUNOS
function linkaluno(aluno) { // Função que cria links para os alunos
return { //retorna um objeto com os links
    self: { href: `/aluno/${aluno.id}`}, // link para o próprio aluno
    update: { href: `/aluno/${aluno.id}`, method: "PUT"}, // link para atualizar o aluno
    delete: { href: `/aluno/${aluno.id}`, method: "DELETE"}, // link para deletar o aluno
    post: {href: `/aluno`, method: "POST"}, // link para criar um novo aluno
    patch: {href: `/aluno/${aluno.id}`, method: "PATCH"} // link para fazer atualizações parciais
}
};

// ENDPOINT DO BANCO DE DADOS ALUNOS (GET ALL)
app.get('/aluno', (req, res) => { // app.get é o verbo HTTP GET, que é usado para buscar dados
const response = alunos.map(aluno => ({ // percorre o vetor de alunos e cria um novo vetor com os dados
    ...aluno,
    link: linkaluno(aluno), // adiciona o link de cada aluno
}));
res.status(200).json(response); // retorna o vetor de alunos com status 200 (OK)
});

//Endpoint para buscar um item específico pelo ID, método GET
app.get('/aluno/:id', (req, res) => { // app.get é o verbo HTTP GET, que é usado para buscar dados
const id = parseInt(req.params.id); // pega o id da URL e converte para inteiro
const aluno = alunos.find(aluno => aluno.id === id); // procura o aluno pelo id

if (aluno) {

    const response = alunos.map(aluno => ({ // percorre o vetor de alunos e cria um novo vetor com os dados
    ...aluno,
    link: linkaluno(aluno), // adiciona o link de cada aluno
}));

    res.status(200).json(response[id - 1]); // retorna o aluno encontrado com status 200 (OK)
} else {
    res.status(404).json({ message: "Item não encontrado" }); // se o aluno não for encontrado, retorna status 404 (Not Found) com uma mensagem de erro
}
});

// Endpoint para adicionar um novo item, método POST
app.post('/aluno', (req, res) => { 

if (!req.body.name) {
    return res.status(422).json({ message: "O campo 'name' não pode ser vazio." }); // Validação para garantir que o campo 'name' não seja vazio
}
else if (!req.body.email) {
    return res.status(422).json({ message: "O campo 'email' não pode ser vazio." }); // Validação para garantir que o campo 'email' não seja vazio
}
else if (!req.body.matricula) {
    return res.status(422).json({ message: "O campo 'matricula' não pode ser vazio." }); // Validação para garantir que o campo 'matricula' não seja vazio
}
else if (!req.body.telefone) {
    return res.status(422).json({ message: "O campo 'telefone' não pode ser vazio." }); // Validação para garantir que o campo 'telefone' não seja vazio
}

//os arrays tem uma propriedade chamada length... essa propriedade calcula o tamanho
//do meu vetor e retorna ele em formato de inteiro...
const newItem = { id: alunos.length + 1, ...req.body}
//push insere um novo item no vetor...
alunos.push(newItem);
res.status(201).json(newItem);
});

//Endpoint para apagar um item, método DELETE
app.delete('/aluno/:id', (req, res) => { 
const id = parseInt(req.params.id); // pega o id da URL e converte para inteiro
const index = alunos.findIndex(aluno => aluno.id === id); // procura o aluno pelo id
if(index !== -1) {
    alunos.splice(index, 1); // remove o aluno do vetor
    res.status(200).json({mensage: "Item removido!"}); // retorna uma mensagem de sucesso com status 200 (OK)
} else {
    res.status(404).json({mensage: "Item não encontrado"}); // se o aluno não for encontrado, retorna status 404 (Not Found) com uma mensagem de erro
}
});

//Endpoint para atualizar itens da lista, método PUT
app.put('/aluno/:id', (req, res) => {
const id = parseInt(req.params.id);
const index = alunos.findIndex(aluno => aluno.id === id); 
if (!req.body.name || req.body.name.trim() === "") {
    return res.status(422).json({ message: "O campo 'name' não pode ser vazio." }); // Validação para garantir que o campo 'name' não seja vazio
}
else if (!req.body.email || req.body.email.trim() === "") {
    return res.status(422).json({ message: "O campo 'email' não pode ser vazio." }); // Validação para garantir que o campo 'email' não seja vazio
}
else if (!req.body.matricula || req.body.matricula.trim() === "") {
    return res.status(422).json({ message: "O campo 'matricula' não pode ser vazio." }); // Validação para garantir que o campo 'matricula' não seja vazio
}
else if (!req.body.telefone || req.body.telefone.trim() === "") {
    return res.status(422).json({ message: "O campo 'telefone' não pode ser vazio." }); // Validação para garantir que o campo 'telefone' não seja vazio
}


if (index !== -1) { // se o aluno for encontrado
    alunos[index] = {id, ...req.body} // atualiza o aluno com os novos dados
    res.status(200).json(alunos[index]); // retorna o aluno atualizado com status 200 (OK)
} else {
    res.status(404).json({ message: "Item não encontrado!"}); // se o aluno não for encontrado, retorna status 404 (Not Found) com uma mensagem de erro
}

});

//Endpoint para fazer atualizações parciais, método PATCH
app.patch('/aluno/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (alunos[id - 1]) {
        // Atualiza apenas os campos enviados no body
        alunos[id - 1] = { ...alunos[id - 1], ...req.body};
        res.status(200).json(alunos[id - 1]); // retorna o aluno atulizado com status 200 (OK)
    } else {
        res.status(404).json({ message: "Item não encontrado!" }); // retorna erro 404 (item não encontrado), se o aluno não for encontrado
    } 
});

// listener da porta do servidor (porta 3000)
app.listen(port, () => {
console.log(`O servidor está rodando em http://localhost:${port}`);
});

