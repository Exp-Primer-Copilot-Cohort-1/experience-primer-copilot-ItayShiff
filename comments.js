// Create web server

'use strict';

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import models
const {Comment} = require('./models');

// Create router
const router = express.Router();

// Create parser
const jsonParser = bodyParser.json();

// Create GET endpoint for /comments
router.get('/', (req, res) => {
  Comment
    .find()
    .then(comments => {
      res.json(comments.map(comment => comment.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// Create GET endpoint for /comments/:id
router.get('/:id', (req, res) => {
  Comment
    .findById(req.params.id)
    .then(comment => res.json(comment.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// Create POST endpoint for /comments
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['text', 'author', 'post'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      res.status(400).json({message: `Missing \`${field}\` in request body`});
    }
  }

  Comment
    .create({
      text: req.body.text,