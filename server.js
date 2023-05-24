const express=require('express');
const jwt=require('jsonwebtoken');
const lowdb=require('lowdb');
const FileSync=require('lowdb/adapters/FileSync');
const nanoid=require('nanoid');
const app = express();
const adapter=new FileSync('db.json');
const db=lowdb(adapter);
db.defaults({users:[]}).write();

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });
app.get('/home',(req,res)=>{
  console.log("working");
    res.send({status:"working"});
    
});
app.post('/api/register',(req,res)=>{
  console.log("workingok");
  const user=req.body;
  db.get('users').push({... user,id:nanoid()}).write();
  res.status(200).send(user);
});

app.post('/api/updateUser',(req,res)=>{
  const newUser=req.body;
  const existing=db.get('users').findIndex({id:newUser.id}).value()
  db.get('users').splice(existing, 1, newUser).write();
  res.status(200).json({message:"success"});
});

app.post('/api/login',(req,res)=>{
  const user=req.body;
  const userExists=db.get('users').find({'name':user.name,'password':user.password}).value();
  if(userExists){
    const token = jwt.sign({ username: user.name }, 'a67a89d9f89f89f99f./99f98f98eee8893022j9j390d-j93j9');
    res.status(200).json({ message: 'Login successful', token: token,user:userExists });
    console.log(userExists);
    console.log("working login");
  }
  else{
    res.status(401).json({message:'Login unsuccessful'});
  }
});
app.post('/api/user',(req,res)=>{
  const cur=req.body;
  const user=db.get('users').find({'name':cur.name,'password':cur.password}).value();
  res.send(user);
});
app.post('/api/users',(req,res)=>{
  const loc=req.body;
  res.send(db.get('users').filter({['loc']:loc.loc}).value());
});
  const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
db format
{
      "name": "",
      "phone": ,
      "gstin": "",
      "loc": "",
      "password": ""
}
*/