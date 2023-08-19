const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password> <name of person> <number> or node mongo.js <password>');
    process.exit()
} else if(process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const url = `mongodb://fullstack:fullstack@ac-oczpbnc-shard-00-00.qzx21qr.mongodb.net:27017,ac-oczpbnc-shard-00-01.qzx21qr.mongodb.net:27017,ac-oczpbnc-shard-00-02.qzx21qr.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-8rgob8-shard-0&authSource=admin&retryWrites=true&w=majority`;

    mongoose.connect(url)

    const phonebookSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Phonebook = mongoose.model('Phonebook', phonebookSchema)

    const person = new Phonebook({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    const url = `mongodb://fullstack:fullstack@ac-oczpbnc-shard-00-00.qzx21qr.mongodb.net:27017,ac-oczpbnc-shard-00-01.qzx21qr.mongodb.net:27017,ac-oczpbnc-shard-00-02.qzx21qr.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-8rgob8-shard-0&authSource=admin&retryWrites=true&w=majority`;

    mongoose.connect(url)

    const phonebookSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Phonebook = mongoose.model('Phonebook', phonebookSchema)

    Phonebook.find({})
        .then(result => {
            console.log('phonebook:');
            result.forEach(person => {
                console.log(person.name, person.number);
            })
            mongoose.connection.close();
        })
}