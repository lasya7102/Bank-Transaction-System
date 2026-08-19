// RJysjDzbretgkNId

// mongodb+srv://lasyanimma998_db_user:Vx32ZcgIidtbtIRN@cluster0.fgqjqwl.mongodb.net/

const mongoose=require('mongoose');
async function connectDB()
{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Database connected successfully")
    })
    .catch(err=>{
        console.error("Error connecting to DB");
        process.exit(1);
    })
}
module.exports=connectDB;