// public/core.js
var estiloEditPadrao = {
			'background-color': '#FFFFFF',
			'border': '0px solid #FFF',
			'padding': '6px 12px'
		};
var kbadmin = angular.module("kbadmin", [])
.controller('principalController', function ($scope, $http) {
	$http.get("/api/obterparametros")
        .success(function (data) {
            $scope.parametros = data.objeto.parametros;
        })
        .error(function (data) {
            console.log(data);
        });

    $scope.adicionarParametro = function () {
        $http.post("/api/adicionarparametro", $scope.parametro)
            .success(function (data) {
                $scope.parametro = {};
                $scope.parametro.resultadocriacao = data.mensagem;
                $scope.parametros.push(data.objeto.parametro);
            })
            .error(function (data) {
                console.log("Error: " + data.mensagem); 
            });
    };

    $scope.gravarOuAtualizarParametro = function (pParametro) {
        $http.post("/api/gravarouatualizarparametro", pParametro)
            .success(function (data) {
                $scope.artigo = {};
                //c(data.mensagem); //trocar por algo tipo 'Toast' do Android
                //lObterUltimosArtigos($http, $scope);
                //$scope.goDogs = !$scope.goDogs;
            }).error(function(data) {
                console.log(data);
            });
    };

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
        });
    }
	
    $scope.editarParametro = function(pParam) {
		console.log('editando o parametro de chave ' + pParam.chave);
		console.log(pParam);
		if (!$scope.editavel) {
            $scope.estiloPadrao = {
			    'background-color': '#FFFFFF',
			    'border': '1px solid #ccc',
				'font-size': '14px',
				'border-radius': '4px',
				'box-shadow': 'inset 0 1px 1px rgba(0,0,0,0.075)',
				'transition': 'border-color ease-in-out .15s,box-shadow ease-in-out .15s'
			};
		    $scope.editavel = !$scope.editavel;
		}
    }
	
	$scope.estiloPadrao = estiloEditPadrao;
	
    $scope.parouEditarParametro = function(pParam) {
        $scope.estiloPadrao = estiloEditPadrao;
		$scope.editavel = !$scope.editavel;
		
		$scope.gravarOuAtualizarParametro(pParam);
    }
});