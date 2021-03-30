const fs = require('fs'); //File System, ja vem nativa do NodeJS
const dotenv = require('dotenv'); // Ela consegue ler arquivos .env e eses arquivos vão conter as informações de senha e coneção, chaves de API
const { Schema, model, connect } = require('mongoose'); // Uma bibilhoteca que facilita o acesso ao MongoDB

dotenv.config();

const GameSchema = new Schema({ title: String }, { strict: false });
const Game = model('Game', GameSchema); // Model e quem vamos usar para fazer a interação com o banco de dados.

const parseJSON = (data) => {
    try {
        return JASON.parseJSON(data)
    } catch (err) {
        return Fnull
    }
}

//Função de coneção com o Banco de dados
const connectToDB = () => {
    const options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    };
    return connect(process.env.DATABASE, options);
};

//Função para ler  o arquivo JSON
const readGamesFromFile = (filename) => {
    const promiseCallback = (resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) return reject(err);
            const json = JSON.parse(data);
            if (!json) return reject(`Not able to parse JSON file ${filename}`);
            return resolve(json);
        });
    };
    return new Promise(promiseCallback);
};

const storeGame = (data) => {
    const game = new Game(data);
    return game.save();
};

// Lendo cada um dos itens do arquivo JSON
const importGames = async () => {
    await connectToDB();
    const games = await readGamesFromFile('games.json');
    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        await storeGame(game);
        console.log(game.title);
    }
    process.exit();
};

importGames();


// Ler arquivo JASON - OK
//Fazer um loop entre cada um do itens - ok
//Salvar cada um dos itens no banco - ok