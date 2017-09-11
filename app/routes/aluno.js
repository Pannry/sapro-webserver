var bcrypt = require('bcrypt-nodejs');

module.exports = function (app) {
    var passport = app.get('passport');

    app.get('/', function(req, res){
        res.render('index', {
            page_name: req.path
        });
    });

    /**
     * Cadastro
     */
    app.get('/aluno/signup', function (req, res) {
        var conexaoDb = app.infra.banco.dbConnection();
        var instituicaoDAO = new app.infra.banco.InstituicaoDAO(conexaoDb);

        instituicaoDAO.lista(function (exception, resultado) {
            res.render('aluno/signup', { 
                listaDeInstituicao: resultado,
                page_name: req.path
            });
        });

        conexaoDb.end();
    });

    app.post('/signup/aluno', function (req, res) {
        var usuario = req.body;

        // usuario.senha = bcrypt.hashSync(usuario.senha, null, null);

        var conexaoDb = app.infra.banco.dbConnection();
        var usuarioDAO = new app.infra.banco.UsuarioDAO(conexaoDb);

        usuarioDAO.salvarAluno(usuario, function (erro, resultado) {
            res.redirect('/aluno/login');
        });
        conexaoDb.end();
    });


    /**
     * Login 
     */
    app.get('/aluno/login', function (req, res) {
        res.render('aluno/login', {
            page_name: req.path
        });
    });

    app.post('/login/aluno', passport.authenticate('local-login-aluno', {
        successRedirect: '/profile/perfil',
        failureRedirect: '/aluno/login',
    }));


    /**
     * profile
     */
    app.get('/profile/perfil', checkAuthentication, function (req, res) {
        res.render('aluno/perfil/perfil', { 
            user: req.user,
            page_name: req.path,
            isProf: false
        });
    });

    app.get('/profile/turmas', checkAuthentication, function (req, res) {
        res.render('aluno/perfil/turmas', { 
            user: req.user,
            page_name: req.path,
            isProf: false
         });
    });

    app.get('/profile/notas', checkAuthentication, function (req, res) {
        res.render('aluno/perfil/notas', { 
            user: req.user,
            page_name: req.path,
            isProf: false
         });
    });

}

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }

}