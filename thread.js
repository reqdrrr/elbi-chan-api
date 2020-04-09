const mongoose = require('mongoose')
const {MongoClient} = require('mongodb');
mongoose.connect('mongodb+srv://rqmdrrr:Oxvrw5FPlewsE8pc@rqmdrrr-drugv.mongodb.net/textboard?retryWrites=true&w=majority', { useNewUrlParser: true })


//THREAD MODEL=========================================
var Schema = mongoose.Schema
var threadSchema = new Schema({
	ThreadCategory: String,
    ThreadTitle: String,
	ThreadAuthor: String,
	ThreadDate: Date,
	ThreadBody: String,
	SessionId: String,
	ThreadComments: [{
		CommentAuthor: String,
		CommentDate: Date,
		CommentBody: String,
		SessionId: String
	}]
},
{collection: 'threads'})
var Thread = mongoose.model('Thread', threadSchema)

exports.findThreadsByCategory = (req, res, next) => {
	const threadCategory = req.query.category

	Thread.find({ThreadCategory: threadCategory}, null, {sort: {ThreadDate: -1}}, function(err, threads){
		if(!err){
			if(!threads || threads.length === 0) return res.send({success:false, message: 'Unexpected error'})
			else return res.send({success: true, threads})	
		}
		else return res.send({success:false, message: 'Unexpected error'})
	})
}

exports.findAllThreads = (req, res, next) => {
	Thread.find( (err, threads) => {
		if(!err) res.send({ success: true, threads })
		else return res.send({success:false, message: 'Unexpected error'})
	} )
}

exports.findThreadById = (req, res, next) => {
	Thread.findOne({_id: req.query.id}, (err, thread) => {
		if(!err){
			if(thread != null){
				return res.send({ success: true, thread })
			}else return res.send({ success: false, message: 'Unexpected error' })
		}else return res.send({ success: false, message: 'Unexpected error' })
	})
}

exports.addThread = (req, res, next) => {
	const newThread = new Thread({
		ThreadCategory: req.body.threadCategory,
		ThreadTitle: req.body.threadTitle,
		ThreadAuthor: req.body.threadAuthor,
		ThreadDate: new Date(),
		ThreadBody: req.body.threadBody,
		SessionId: req.body.sessionId
	})

	newThread.save((err) => {
		if(!err) return res.send({ success: true, newThread })
		else return res.send({ success: false, message: 'Unexpected error' })
	})
}

exports.findCommentsToThread = (req, res, next) => {
	Thread.find( {_id:req.query.id}, (err,thread) => {
		comments = thread.ThreadComments
		if(!err) {
			if(thread != null) {
				return res.send({ success:true, comments })
			}else return res.send({ success: false, message: 'Unexpected error' })
		}else return res.send({ success: false, message: 'Unexpected error' })

	} )
}


exports.addCommentToThread = (req, res, next) => {
	const newComment = {
		CommentAuthor: req.body.commentAuthor,
		CommentDate: new Date(),
		CommentBody: req.body.commentBody
	}

	Thread.findOneAndUpdate( {_id: req.body.id}, {$push: {ThreadComments: newComment}}, (err,thread) => {
		if(!err) return res.send({ success: true, thread })
		else return res.send({ success: false, message: 'Unexpected error' })
	})
}

exports.deleteComment = (req, res, next) => {
	Thread.findOne({_id: req.body.id}, (err, thread) => {
		if(!err){
			if(thread != null){
				for(var i=0; i<thread.ThreadComments.length; i++) {
					if(thread.ThreadComments[i].CommentBody===req.body.content && thread.ThreadComments[i].CommentAuthor==req.body.author) {
						thread.ThreadComments.splice(i,1)
					}res.send({ success: true })
				}
			}else return res.send({ success: false, message: 'Unexpected error' })
		}else return res.send({ success: false, message: 'Unexpected error' })
	})
}

exports.deleteThreadbyId = (req, res, next) => {
	Thread.findOne({_id: req.query.id}, (err, thread) => {
		if(!err){
			if(thread != null){
				Thread.deleteMany({_id:req.query.id}, (err,out) => {} )
				return res.send({ success: true, message: 'Successfully deleted thread' })
			}else return res.send({ success: false, message: 'Unexpected error' })
		}else return res.send({ success: false, message: 'Unexpected error' })
	})
}