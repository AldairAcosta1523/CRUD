require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000


const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect()

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  connection.query('SELECT * FROM productos', (error, results, fields) => {
    if (error) throw error;
    res.render('index', { data: results });
  });
});

app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM productos WHERE id = ?', [id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.redirect('/');
    }
  });
});

// FUNCION PARA CREAR VALORES 

app.get('/create', (req,res)=>{
  res.render('create');
})

app.use(bodyParser.urlencoded({ extended: true }));

exports.save = (req, res,connection) => {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const cantidad = req.body.cantidad;
  const marca = req.body.marca;
  const precio = req.body.precio;

  connection.query('INSERT INTO productos SET ?', { nombre: nombre, descripcion: descripcion, cantidad: cantidad , marca: marca, precio: precio }, (error, results) => {
    if (error) {
      throw error;
    } else {
      res.redirect('/');
    }
  });
};

// FUNCION PARA EDITAR VALORES 

app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM productos WHERE id = ?', [id], (error, results, fields) => {
    if (error) throw error;
    res.render('edit', { product: results[0] });
  });
});

app.use(bodyParser.urlencoded({ extended: true }));

exports.update = (req, res, connection) => {
  const id = req.body.id;
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const cantidad = req.body.cantidad;
  const marca = req.body.marca;
  const precio = req.body.precio;

  connection.query('UPDATE productos SET nombre = ?, descripcion = ?, cantidad = ?, marca = ?, precio = ? WHERE id = ?', [nombre, descripcion, cantidad, marca, precio, id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.redirect('/');
    }
  });
};

app.post('/update', (req, res) => {
  exports.update(req, res, connection);
});


app.post('/save', (req, res) => {
  exports.save(req, res, connection);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
