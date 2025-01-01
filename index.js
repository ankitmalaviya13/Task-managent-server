require('dotenv').config();

const connectDB = require('./Database/connect.js');

const { app } = require('./app');

const PORT = process.env.PORT || 8080;  

const start = async () => {
    console.log(process.env.MONGODB_URI);
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT, () => console.log('listening on *:8585'));
        // app.listen(PORT, () => { console.log(`Server is running on PORT ${PORT}`) });  
        } catch (error) {
            console.log(error);
        }
};


start();

// process.exit(1);



