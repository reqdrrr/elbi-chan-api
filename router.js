const threadController = require('./thread');

module.exports = (app) => {

    // Allow Cross Origin Resource Sharing
    app.use((req, res, next) => {
      // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      // res.setHeader('Access-Control-Allow-Origin', 'https://text-ch.web.app');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
      next();
    })
  
    app.get('/find-threads-by-category', threadController.findThreadsByCategory)
    app.post('/add-thread', threadController.addThread)
    app.get('/find-all-threads', threadController.findAllThreads)
    app.post('/add-comment-to-thread', threadController.addCommentToThread)

   
  }