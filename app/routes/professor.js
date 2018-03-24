var multer = require( 'multer' );

var storage = multer.diskStorage( {
    destination: 'app/uploads/',
    filename: function ( req, file, cb ) {
        cb( null, Date.now().toString().substring( 5, 13 ) + '_' + file.originalname )
    }
} );

const upload = multer( { storage: storage } );

module.exports = function ( app ) {

    var passport = app.get( 'passport' );

    var Professor = app.controllers.professor.Professor;
    var Exercicios = app.controllers.professor.Exercicios;
    var Turmas = app.controllers.professor.Turmas;
    var Notas = app.controllers.professor.Notas;
    var Didatico = app.controllers.professor.Didatico;

    app.get( '/professor', function ( req, res ) {
        ( req.user == undefined ) ?
            res.render( 'professor/home', { accountType: "" } ) :
            res.render( 'professor/home', { accountType: req.user.tipo } );
    } );

    /**
     *  Professor.js
     */

    app.route( '/professor/signup' )
        .get( Professor.cadastro.get )
        .post( Professor.cadastro.post );

    app.route( '/professor/login' )
        .get( Professor.login.get )
        .post( Professor.login.post );

    app.route( '/logout' )
        .get( Professor.logout );

    app.route( '/professor/profile' )
        .get( checkAuth, Professor.perfil.get );

    app.route( '/professor/profile/update' )
        .get( checkAuth, Professor.perfil.update );


    /**
     *      Turmas.js
     */
    app.route( '/professor/profile/turmas' )
        .get( checkAuth, Turmas.painelDasTurmas.get );

    app.route( '/professor/turmas/criar' )
        .get( checkAuth, Turmas.criarTurmas.get )
        .post( checkAuth, Turmas.criarTurmas.post );

    app.route( '/professor/turma/abrir/:id/professor' )
        .get( checkAuth, Turmas.abrir.professorGET )
        .post( checkAuth, Turmas.abrir.autenticarAlunoNaTurma )

    app.route( '/professor/turma/abrir/:id/aluno' )
        .get( checkAuth, Turmas.abrir.alunoGET )
        .post( checkAuth, Turmas.abrir.comentario );

    app.route( '/professor/turma/abrir/:id/aluno/incluirlista' )
        .get( checkAuth, Turmas.incluirlista.get )
        .post( checkAuth, Turmas.incluirlista.post );

    app.route( '/professor/turma/abrir/:id/aluno/incluirDidatico' )
        .get( checkAuth, Turmas.incluirDidatico.get )
        .post( checkAuth, Turmas.incluirDidatico.post );

    // app.post( '/professor/turma/editar/:id', checkAuth, Turmas.turma.editar );
    // app.post('/professor/turma/excluir/:id', checkAuth, Turmas.turma.excluir);


    /**
     *      Exercicios
     */

    // Questões
    app.route( '/professor/profile/exercicios' )
        .get( checkAuth, Exercicios.exercicios.get );

    app.route( '/professor/exercicios/abrir/:id' )
        .get( checkAuth, Exercicios.abrirExercicio.get );

    app.route( '/professor/exercicios/criar' )
        .get( checkAuth, Exercicios.criarExercicios.get )
        .post( checkAuth, upload.array( 'fileUpload', 5 ), Exercicios.criarExercicios.post );

    app.route( '/professor/exercicios/abrir/:id/download/:path' )
        .get( checkAuth, Exercicios.downloadExercicios.get );


    // Listas
    app.route( '/professor/profile/exercicios/lista' )
        .get( checkAuth, Exercicios.lista.get );

    app.route( '/professor/exercicios/lista/criar' )
        .get( checkAuth, Exercicios.criarLista.get )
        .post( checkAuth, Exercicios.criarLista.post );

    app.route( '/professor/exercicios/lista/abrir/:id/info' )
        .get( checkAuth, Exercicios.abrirLista.mostrarInformacoes );

    app.route( '/professor/exercicios/lista/abrir/:id/questoes' )
        .get( checkAuth, Exercicios.abrirLista.mostrarQuestoes )

    app.route( '/professor/exercicios/lista/abrir/:id/editar' )
        .get( checkAuth, Exercicios.adicionarExercicioNaLista.get )
        .post( checkAuth, Exercicios.adicionarExercicioNaLista.post );

    /**
     *      Nota
     */

    app.route( '/professor/turma/abrir/:id_sala/professor/:id_aluno' )
        .get( checkAuth, Notas.abrir.professorGET )

    app.route( '/professor/turma/abrir/:id_sala/professor/:id_aluno/:id_lista' )
        .get( checkAuth, Notas.abrir.verExerciciosRespondidos )
        .post( checkAuth, Notas.abrir.post );

    /**
     *      MATERIAL DIDATICO
     */

    app.route( '/professor/profile/didatico' )
        .get( checkAuth, Didatico.painelDidatico.get );

    app.route( '/professor/profile/didatico/criar' )
        .get( checkAuth, Didatico.criarDidatico.get )
        .post( checkAuth, upload.array( 'fileUpload', 5 ), Didatico.criarDidatico.post );

    app.route( '/professor/didatico/abrir/:id/download/:path' )
        .get( checkAuth, Didatico.downloadDidatico.get );

    app.route( '/professor/didatico/abrir/:id/' )
        .get( checkAuth, Didatico.abrirDidatico.get );



}

function checkAuth ( req, res, next ) {
    if ( req.isAuthenticated() )
        return next();
    else
        res.redirect( '/' );


}