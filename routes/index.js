var express = require('express');
var router = express.Router();

var fs = require('fs');

var Cart = require('../models/cart');
var didResolver = require('../models/presentation-resolver');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

router.get('/', function (req, res, next) {
  res.render('index', 
  { 
    title: 'NodeJS Shopping Cart',
    products: products
  }
  );
});

router.get('/add/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  res.redirect('/');
});

router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'NodeJS Shopping Cart',
    products: cart.getItems(),
    discountRate: cart.discountRate * 100,
    discountPrice: Math.round(cart.totalPrice * cart.discountRate),
    totalPrice: cart.totalPrice - Math.round(cart.totalPrice * cart.discountRate),
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/discount', function(req, res, next) {
  res.render('discount', {
    title: 'NodeJS Shopping Cart',
  });
})

router.post('/verify', function(req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  const option = req.body.option;
  const qrData = req.body.qrData;
  try {
    if(option == 'vc') {
      didResolver.verifiedVC(qrData);
    } else if(option == 'vp') {
      didResolver.verifiedVP(qrData);
    }
    cart.discount(0.5);
  } catch (error) {
    console.error(error);
    res.redirect('/cart');
  }
  
  req.session.cart = cart;
  res.redirect('/cart');
});

module.exports = router;
