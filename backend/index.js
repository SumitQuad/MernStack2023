const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const config = require("config");
const router = express.Router();
const Product = require("./Models/Product");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

mongoose.connect('mongodb+srv://Sumitdb:PyZ3@cluster0.dpyfy.mongodb.net/NewLogin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// const storage = multer.diskStorage({
//     destination: './images',
//     filename: function(req, file, cb) {
//       cb(
//         null,
//         file.fieldname + '-' + Date.now() + path.extname(file.originalname)
//       );
//     }
//   });
  
//   const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 },
//     fileFilter: function(req, file, cb) {
//       checkFileType(file, cb);
//     }
//   }).single('image');
  
//   function checkFileType(file, cb) {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
  
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb('Error: Images Only!');
//     }
//   }



const products = [
    {
      name: "Product 1",
      price: 10,
      image:"laptop",
      description: "Description of product 1"
    },
    {
      name: "Product 2",
      price: 100,
      image:"laptop",
      description: "Description of product 2"
    }
  ];
  
  products.forEach(async product => {
    const newProduct = new Product(product);
    await newProduct.save();
  });
  
  

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'secretkey');
    res.send({ token });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }, (err, user) => {

        if (err) return res.status(500).send("Error finding the user");
        if (!user) return res.status(400).send("Username or password is incorrect");

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).send("Error in bcrypt compare");
            if (!isMatch) return res.status(400).send("Username or password is incorrect");

            const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
            res.header("x-auth-token", token).send({
                name: username,
                token
            });
        });
    });
});


app.post('/logout', async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    jwt.verify(token, 'secretkey', (error, user) => {
        if (error) {
            return res.status(401).send({ error: 'Token is not valid' });
        }
        req.user = user;
    });
    res.send({ message: 'Successfully logged out' });
});

// Create a product
app.post("/product", async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.send({ message: "Product added successfully!" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

// Update the "/product" endpoint to handle image upload
// app.post("/product", (req, res) => {
//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(400).send({ error: err.message });
//       } else {
//         try {
//           const product = new Product({
//             ...req.body,
//             image: `/uploads/${req.file.filename}`
//           });
//           await product.save();
//           res.send({ message: "Product added successfully!" });
//         } catch (error) {
//           res.status(400).send({ error: error.message });
//         }
//       }
//     });
//   });
  
  // fetch all products
app.get("/fetchproducts", async (req, res) => {
    const products = await Product.find();
    res.send(products);
  });

app.listen(7000, () => {
    console.log('Server is running on port 7000');
});
