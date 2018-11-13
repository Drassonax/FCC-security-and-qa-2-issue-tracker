/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose')

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(CONNECTION_STRING)

let Schema = mongoose.Schema

let issueSchema = new Schema({
  project: String,
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: String,
  updated_on: String,
  open: Boolean
})
let Issue = mongoose.model('Issue', issueSchema)

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      Issue.find({
        project: project /*|| '',
        issue_title: req.body.issue_title || '',
        issue_text: req.body.issue_text || '',
        created_by: req.body.created_by || '',
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        created_on: req.body.created_on || '',
        updated_on: req.body.updated_on || '',
        open: req.body.open || ''*/
      }, (err, docs) => {
        if (err) {
          res.send('could not find')
        } else {
          res.json(docs)
        }
      })
    })
    
    .post(function (req, res){
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.status(400)    
      }
      var project = req.params.project;
      let issue = new Issue({
        project,
        issue_title: req.body.issue_title || '',
        issue_text: req.body.issue_text || '',
        created_by: req.body.created_by || '',
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        open: true
      })
      issue.save()
      res.json(issue)
    })
    
    .put(function (req, res){
      const id = req.body._id
      if (!req.body._id && !req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text && !req.body.open) {
        res.status(400)
      }
      var project = req.params.project;
      Issue.findByIdAndUpdate(id, {
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        open: !req.body.open,
        updated_on: new Date().toUTCString()
      }, (err, doc) => {
        if (err) {
          res.json({message: `could not update ${id}`})
        } else {
          res.json({message: `successfully updated ${id}`})
        }
      })
    })
    
    .delete(function (req, res){
      if (!req.query._id) {
        res.status(400)
      }
      var project = req.params.project;
      const id = req.query._id
      Issue.findByIdAndDelete(id, (err, doc) => {
        if (err) {
          res.json({message: 'could not delete'})
        } else {
          res.json({message: 'deleted'})
        }
      })
    });
};
