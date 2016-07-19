// public/core.js
var kbadminvar = angular.module("kbadmin", []);

var c = function (text) {
    console.log("\'" + text + "\'");
    console.log(text);
    console.log("");
};

function principalController($scope, $http) {
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
                c(data.mensagem); //trocar por algo tipo 'Toast' do Android
                lObterUltimosArtigos($http, $scope);
                $scope.goDogs = !$scope.goDogs;
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

    $scope.editarParametro = function(pParametro) {
        console.log('editandow');
        $scope.estilotravado = {'background-color': '#FFEEEE'};
    }

    $scope.parouEditarParametro = function() {
        console.log('saindo');
        $scope.estilotravado = {'background-color': 'blue'};
    }

    $scope.aaa = function(par) {
        console.log('editando www ');
    }

    $scope.alerto = function(abc) {
        alerto(abc);
    }
}