const { faker } = require('@faker-js/faker');
const mysql2=require('mysql2')
const express = require('express');
const app = express();
const path = require('path')
const methodOverride = require('method-override')

app.set('view engine' ,'ejs');
app.set('views' ,path .join (__dirname,"/views"))
app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}))

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database:'first_database',
    password:'vaibhav1122'
})

function getRandomData() {
    return[
        faker.datatype.uuid(),
        faker.internet.userName(),
         faker.internet.email(),
         faker.internet.password(),
        
    ]
}

app.get('/',(req,res)=>{
    let q=`SELECT COUNT(*) AS count FROM user`;
    try {
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let  count = result[0].count;
        console.log(count)
        res.render('home',{count});
    }) 
}catch(err){
    console.log(err);
    res.render("some error in data base")
}
})

app.get('/user', (req, res) => {
    let q=`SELECT * FROM user`;
    try {
        connection.query(q,(err,users)=>{
            if(err) throw err;
            res.render('user',{users});
        }) 
    }catch(err){
        console.log(err);
        res.render("some error in data base")
    }
})
app.get('/user/:id/edit', (req, res) => {
    const { id } = req.params;
    const q = `SELECT * FROM user WHERE id='${id}'`; 
    
    try {
      connection.query(q, (err, result) => {
        if (err) throw err; 
        const user = result[0];
        res.render('edit', { user });
      });
    } catch (err) {
      console.error('Database error:', err);
      res.render('error', { message: 'Database error' });
    }
  });
  
  // Route to update user data
  app.patch('/user/:id', (req, res) => {
    const { id } = req.params;
    const { password: formPass, username: newUsername } = req.body;
  
    const q = `SELECT * FROM user WHERE id='${id}'`; 
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err; 
        
        const user = result[0];
        if (formPass !== user.password) {
          res.send('Wrong password');
        } else {
          const q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`; 
          
          connection.query(q2, (err, result) => {
            if (err) throw err; 
            res.redirect('/user'); 
          });
        }
      });
    } catch (err) {
      console.error('Database error:', err);
      res.render('error', { message: 'Database error' }); 
    }
  });

  // Route to render a form to add a new user
app.get('/user/new', (req, res) => {
  res.render('new'); // Assuming you have a 'new.ejs' file for the form
});

// POST route to add a new user
app.post('/userpost', (req, res) => {
  const { username, email, password } = req.body;

  // Validation: Ensure that all fields are provided
  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  const userId = faker.datatype.uuid(); // Generate a unique ID for the user
  const q = `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`;

  connection.query(q, [userId, username, email, password], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.render('error', { message: 'Database error' });
    } else {
      res.redirect('/user'); // Redirect to the list of users or wherever appropriate
    }
  });
});

//delte
app.delete('/user/:id', (req, res) => {
  const { id } = req.params; // Get user ID from route parameters
  const q = `DELETE FROM user WHERE id = ?`; // SQL query to delete a user

  connection.query(q, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.render('error', { message: 'Database error' });
    }

    // If the query was successful, redirect to the users list or another appropriate route
    res.redirect('/user');
  });
});

//port
app.listen(3000,()=>{
    console.log('app is listning')
});