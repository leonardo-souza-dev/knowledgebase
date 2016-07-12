// public/core.js
var baseconh = angular.module('scotchTodo', []);

function c(text) {
    console.log('\'' + text + '\'');
    console.log(text);
    console.log('');
}

function lObterUltimosArtigos($http, $scope) {
	return $http.get('/api/obterultimosartigos')
			.success(function(data){
				$scope.uartigos = data.objeto.artigos;			
			}).error(function(data){
				console.log(data);
			});	
}

function mainController($scope, $http) {
	
	lObterUltimosArtigos($http, $scope);
	
	$http.get('/api/obtersistemas')
		.success(function(data){
			$scope.sistemas = data.objeto.sistemas;			
		}).error(function(data){
			console.log(data);
		});
	
	//mock
	$scope.artigos = [{titulo: 'I-ntegrating WordPress with Your Website', data: '25 Feb, 2013', sistema: 'SAG'},
					{titulo: 'W-ordPress Site Maintenance', data: '25 Feb, 2014', sistema: 'Corporate'},
					{titulo: 'M-eta Tags in WordPress', data: '25 Feb, 2015', sistema: 'Admin'},
					{titulo: 'W-ordPress in Your Language', data: '25 Feb, 2016', sistema: 'SAG'}];
	//mock
	$scope.uartigos = function() {
		lObterUltimosArtigos();					
	};
	
    $scope.sistema = {};

    $scope.adicionarSistema = function(){
        $http.post('/api/criarsistema', $scope.sistema)
            .success(function(data) {
                $scope.sistema = {}; // clear the form so our user is ready to enter another
                $scope.sistema.resultadocriacao = data.mensagem;
				$scope.sistemas.push(data.objeto.sistema); //atualiza scope com novo sistema adicionado
            })
            .error(function(data) {
                console.log('Error: ' + data.mensagem);
            });
    };
	
	$scope.gravarOuAtualizarArtigo = function(pArtigo) {
		
		$http.post('/api/gravarouatualizarartigo', pArtigo)
			.success(function(data){
                $scope.artigo = {};
                c(data.mensagem); //TODO:trocar por algo tipo 'Toast' do Android
				
				// if (data.objeto.foiInsert) {
					// $scope.uartigos.push(data.objeto.artigo); //atualiza 'Últimos Artigos' com novo artigo adicionado
					// $scope.uartigos.reverse();
				// }
				lObterUltimosArtigos($http, $scope);
				$scope.goDogs = !$scope.goDogs;
			}).error(function(data){
                console.log(data);				
			});
	}
	
	$scope.editarArtigo = function(art) {
		$scope.goDogs = !$scope.goDogs;
		$scope.artigo = { sistema: art.sistema, titulo: art.titulo, corpo: art.corpo, _id: art._id };
	}
	
	/*

    $scope.createUserOld = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.createUser = function() {
        $http.post('/api/createuser')
            .success(function(msg) {
                console.log(msg);
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.setupresult = msg;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.searchMovie = function() {
        $http.post('/api/search', $scope.formData)
            .success(function(data) {
                console.log('data');
                console.log(data);
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.searchresult = data.object.movies;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when submitting the add form, send the text to the node API
    $scope.createMovie = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteMovie = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.updateuser = function(id) {
        $http.post('/api/updateuser/' + $scope.formData)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	*/
}