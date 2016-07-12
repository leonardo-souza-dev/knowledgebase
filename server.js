// server.js
    // set up ========================
    var express        = require('express');
    var app            = express();                               // create our app w/ express
    var mongoose       = require('mongoose');                     // mongoose for mongodb
	var jwt            = require('jsonwebtoken'); // used to create, sign, and verify tokens
    var morgan         = require('morgan');             // log requests to the console (express4)
    var bodyParser     = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    // configuration =================
    mongoose.connect('mongodb://localhost');
    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
	app.set('superSecret', 'ilovescotchyscotch'); // secret variable
	
	// define model =================
    var Sistema = mongoose.model('Sistema', {
        nome: String
    });
	var ObjectId = mongoose.Schema.Types.ObjectId;
    var Artigo = mongoose.model('Artigo', {
        sistema: String, titulo: String, corpo: String, data_criacao: Date, 
		data_atualizacao: Date, id: ObjectId
    });	
    
	// routes ======================================================================
    // api ---------------------------------------------------------------------

	function generateUUID() {
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	};

	function createToken(pUser) {
		console.log('entrou no createUser');
		return jwt.sign(pUser, app.get('superSecret'), { expiresIn: 86400 /* expires in 24 hours*/ });
	}

	app.post('/api/criarsistema', function(req, res) {
		Sistema.create({ 
			nome: req.body.nome
		}, function(err, data) {
			if (err) res.send(err);

			res.json({ sucesso: true, mensagem: "Sistema criado!", objeto: { sistema: data } });
		});
	});

	app.post('/api/gravarouatualizarartigo', function(req, res) {
		console.log(req.body);
		console.log('Novo artigo a ser criado. Titulo: ' + req.body.titulo);
		var condicao = { _id: req.body._id }, options = { multi: true };
		
		Artigo.findOne(condicao, '_id', function (err, doc) {
			if (err) return handleError(err);

			if (doc._id != null) {
				
				Artigo.update(condicao, { 
				sistema: req.body.sistema,
				titulo: req.body.titulo,
				corpo: req.body.corpo,
				data_atualizacao: new Date()
				}, function(err, numAffected) {
					if (err) console.log(err);
					
					res.json({ sucesso: true, mensagem: "Artigo atualizado!", objeto: { foiInsert: false, numeroRegistrosAfetados: numAffected } });
				});
				
			} else {
				
				Artigo.create({ 
					sistema: req.body.sistema,
					titulo: req.body.titulo,
					corpo: req.body.corpo,
					data_criacao: new Date()
				}, function(err, data) {
					if (err) res.send(err);
					
					console.log('Novo artigo CRIADO! Titulo: ' + req.body.titulo);
					res.json({ sucesso: true, mensagem: "Artigo criado!", objeto: { foiInsert: true, artigo: data } });
				});
				
			}
		})
				
		
	});

    // create todo and send back all todos after creation
    app.get('/api/obtersistemas', function(req, res) {        
		Sistema.find(function(err, data) {
			if (err) res.send(err);
			
			res.json({ sucesso: true, mensagem: "Sistemas obtidos!", objeto: { sistemas: data } });
		});
    });


    app.get('/api/obterultimosartigos', function(req, res) {
		Artigo.find(function(err, data) {
			if (err) res.send(err);
			
			res.json({ sucesso: true, mensagem: "Artigos obtidos!", objeto: { artigos: data } });
		}).limit(50).sort({'data_criacao': 'desc'});
    });
/*
	app.post('/api/authenticate', function(req, res) {

		// find the user
		User.findOne({
			hash: req.body.hash
		}, function(err, user) {
			
			if (err) throw err;

			if (!user) {
				res.json({ success: false, message: 'Authentication failed. User dont exist.' });
			} else if (user) {
				
				// check if password matches
				if (user.password != req.body.password) {
					
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
					
				} else {
					// if user is found and password is right
					// create a token
					var token = createToken(user);
					
					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token!',
						object: { token: token }
					});
				}
			}
		});
	});

    //search
    app.post('/api/search', function(req, res) {

        var term = req.body.searchterm;

        if (term == undefined || term == '')
            return res.send({
						success: false,
						message: 'no term found',
						object: { }
					});


        console.log('req.body.token');
        console.log(req.body.token);
        console.log('');

        if (req.body.token == undefined || req.body.token == '')
            return res.send({
						success: false,
						message: 'no user found',
						object: { }
					});


        User.findOne({
        	token: req.body.token
        }, function(err, user) {

			if (err)
                res.send(err);

            Movie.find({ 
				name: new RegExp(term, "i")
			}, function(err, movies) {
				if (err)
	                res.send(err);

	            var movies2 = new Array();

	            for (i = 0; i < movies.length; i++) {
	            	var lMymovies = user.mymovies;
				    for (j= 0; j < lMymovies.length; j++) {
				    	if (movies[i]._id == lMymovies[j]._id) {
				    		movies[i].isInMyList = true;
				    	} else {
				    		movies[i].isInMyList = false;
				    	}
			    		movies2.push(movies[i]);
				    }
				}

	            // search and return movies searched
	            res.json({
	            	success: true,
	            	message: 'Search complete.',
	            	object: { movies: movies2 }
	            });
	        });
        });        
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {
        // create a todo, information comes from AJAX request from Angular
        Movie.create({
			name: req.body.name, 
			done: false
			}, function(err, todo) {
				if (err) res.send(err);

				// get and return all the todos after you create another
				Movie.find(function(err, todos) {
					if (err)
						res.send(err);
					res.json(todos);
				});
        });
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Movie.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Movie.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });
	
	// get all todos
    app.get('/api/todos', function(req, res) {
        // use mongoose to get all todos in the database
        Movie.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });


	
    //update user
    app.post('/api/updateuser', function(req, res) {
        User.findById(req.params.id, function(err, u) {
			if (!u)
				return next(new Error('Could not load Document'));
			else {
				// do your updates here
				u.modified = new Date();

				u.save(function(err) {
					if (err)
						console.log('error')
					else
						console.log('success')
					});
				}
		});
    });
*/
    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendFile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("WL listening on port 8080");