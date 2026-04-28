const app = require('../backend/app');
const PORT = process.env.PORT || 3000



const runServer = async()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    })  
}
runServer();