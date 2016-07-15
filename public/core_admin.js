// public/core.js
var baseconh = angular.module('kbadmin', []);

function c(text) {
    console.log('\'' + text + '\'');
    console.log(text);
    console.log('');
}


function principalController($scope, $http) {

	$http.get('/api/obterparametros')
		.success(function(data){
			$scope.parametros = data.objeto.parametros;
		}).error(function(data){
			console.log(data);
		});
/*
    $http.post('/api/obterparametro', 'nomelogo')
        .success(function(data){
            $scope.nomelogo = data.objeto.nomelogo;
        }).error(function(data){
            console.log(data);
        });*/

    $scope.adicionarParametro = function(){
        $http.post('/api/adicionarparametro', $scope.parametro)
            .success(function(data) {
                $scope.parametro = {}; // clear the form so our user is ready to enter another
                $scope.parametro.resultadocriacao = data.mensagem;
				$scope.parametros.push(data.objeto.parametro); //atualiza scope com novo sistema adicionado
            })
            .error(function(data) {
                console.log('Error: ' + data.mensagem);
            });
    };
    
    $scope.gravarOuAtualizarParametro = function(pParametro) {
        
        $http.post('/api/gravarouatualizarparametro', pParametro)
            .success(function(data) {
                $scope.artigo = {};
                c(data.mensagem); //TODO:trocar por algo tipo 'Toast' do Android
                
                lObterUltimosArtigos($http, $scope);
                $scope.goDogs = !$scope.goDogs;
            }).error(function(data){
                console.log(data);
            });
    }
    
    $scope.apagarParametro = function(pArtigo) {
        var asd = $scope.uartigos;

        for (var i = 0; i < asd.length; i++) {
            console.log('asd[i]');
            console.log(asd[i]._id);
        };

        $http.post('/api/apagarartigo', pArtigo)
            .success(function(data){
                $scope.artigo = {};
                c(data.mensagem); //TODO:trocar por algo tipo 'Toast' do Android                
                lObterUltimosArtigos($http, $scope);
                $scope.goDogs = !$scope.goDogs;
            }).error(function(data){
                console.log(data);
            });s
    }
    
    $scope.editarParametro = function(pParametro) {

        alert('bbb');
        if (!clicouEditar) {
            $scope.soleitura = !$scope.soleitura;
            clicouEditar = true;
        }
        $scope.estilotravado = $scope.estilodestravado;
        //console.log(pParametro);
        //$scope.showEdits = !$scope.showEdits;
        //$scope.editParametro.chave = 'chavera';//pParametro.chave;
        //$scope.editParametro.valor = 'valore';pParametro.valor;
        //$scope.artigo = { sistema: pParametro.sistema, titulo: art.titulo, corpo: art.corpo, _id: art._id };
    }
    
    $scope.saiu = function() {
        alert('aaa');
        $scope.estilotravado = $scope.estilotravadoBkp;
    }

    var clicouEditar = false;
    
    $scope.estilotravado = estiloLock;
    
    var estiloLock = {
        'width':'50px',
        'display':'inline',
        'border':'0px solid #ccc',
        '-webkit-box-shadow': 'inset 0 0px 0px rgba(0,0,0,0)',
        'cursor':'initial',
        'background-color':'#FFFFFF'};

    $scope.estilodestravado = {
        'width':'50px',
        'display':'inline',
        'border':'1px solid #ccc',
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,0.75)',
        'cursor':'initial',
        'background-color':'#FFFFFF',
        'transition': 'border-color ease-in-out .15s,box-shadow ease-in-out .15s'};
}