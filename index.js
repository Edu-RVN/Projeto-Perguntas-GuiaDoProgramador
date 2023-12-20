const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const conection = require("./database/database");
const perguntaModel = require("./database/pergunta");
const Resposta = require("./database/resposta");

conection.authenticate()
    .then(() => {
        console.log('Conectado com o banco de dados!')
    })
    .catch((msgErro) => {
        console.log("erro")
    })

//Estou dizendo para o Express usar o EJS como view engine      
app.set('view engine', 'ejs');
app.use(express.static('public'));
//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
    perguntaModel.findAll({
        raw: true, order: [
            ['id', 'DESC'] //coluna id e ordena em ordem decrescente
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    })
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    perguntaModel.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')  //redireciona a pagina inicial do site após cadastrar uma nova pergunta
    })
})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id   //pegando o parametro da url
    perguntaModel.findOne({
        where: { id: id }
    
    }).then(pergunta => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ] 
            }).then(respostas =>{
                res.render("pergunta", {
                    pergunta: pergunta ,    //passando os dados da pergunta pro arquivo ejs
                    respostas: respostas
                })
            })
            
        } else {
            res.redirect("/")
        }
    })
})

app.post("/responder", (req, res) => {

    var corpo = req.body.corpo;
    var perguntaId = req.body.perguntaId;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId,
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});


app.listen(2121, () => { console.log("App rodando"); });