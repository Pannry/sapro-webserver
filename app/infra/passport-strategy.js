const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = (app) => {
  const passport = app.get('passport');
  passport.serializeUser((user, done) => {
    const chave = {
      id: user.id,
      tipo: user.tipo,
    };
    done(null, chave);
  });

  passport.deserializeUser((usuario, done) => {
    const conexaoDb = app.infra.banco.dbConnection();
    const usuarioDAO = new app.infra.banco.UsuarioDAO(conexaoDb);

    if (usuario.tipo === 'aluno') {
      usuarioDAO.buscarIdAluno(usuario.id, (err, userType) => {
        const user = userType;
        user[0].tipo = 'aluno';
        done(err, user[0]);
      });
    } else if (usuario.tipo === 'professor') {
      usuarioDAO.buscarIdProfessor(usuario.id, (err, userType) => {
        const user = userType;
        user[0].tipo = 'professor';
        done(err, user[0]);
      });
    }
    conexaoDb.end();
  });

  /**
   * Aluno
   */

  // Login
  passport.use('local-login-aluno', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'senha',
      passReqToCallback: true,
    },
    ((req, username, password, done) => {
      const entrada = {
        email: username,
        senha: password,
      };

      const conexaoDb = app.infra.banco.dbConnection();
      const usuarioDAO = new app.infra.banco.UsuarioDAO(conexaoDb);

      usuarioDAO.buscarAluno(entrada, (err, usuario) => {
        if (err) return done(err);
        if (!usuario.length) {
          return done(null, false, req.flash('loginMessage', 'Oops! Email ou senha não encontrado, tente novamente.'));
        }
        if (!bcrypt.compareSync(entrada.senha, usuario[0].senha)) {
          return done(null, false, req.flash('loginMessage', 'Oops! Email ou senha não encontrado, tente novamente.'));
        }

        const user = usuario;
        user[0].tipo = 'aluno';
        return done(null, user[0]);
      });

      conexaoDb.end();
    }),
  ));

  // Cadastro
  passport.use('local-signup-aluno', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'senha',
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      const entrada = {
        email: username,
        senha: password,
      };

      const newUser = {
        email: username,
        instituicao_id: req.body.instituicao_id,
        nome: req.body.nome,
      };

      const user = {};

      const connDB = app.infra.banco.dbConnection();
      const UsuarioDAO = new app.infra.banco.UsuarioDAO(connDB);

      UsuarioDAO.buscarAluno(entrada, (err, saida) => {
        if (err) return done(err);
        if (saida.length) {
          return done(null, false, req.flash('signupMessage', 'Email não disponivel'));
        }
        if (!saida.length) {
          bcrypt.genSalt((err1, salt) => {
            bcrypt.hash(entrada.senha, salt, (err2, hash) => {
              newUser.senha = hash;

              const connDB2 = app.infra.banco.dbConnection();
              const UsuarioDAO2 = new app.infra.banco.UsuarioDAO(connDB2);

              UsuarioDAO2.salvarAluno(newUser, (err3, insertion) => {
                if (err3) return done(err);
                user.id = insertion.insertId;
                user.tipo = 'aluno';
                return done(null, user);
              });
              connDB2.end();
            });
          });
        }
        return null;
      });
      connDB.end();
    },
  ));

  /**
   * Login do professor
   */

  // Login
  passport.use('local-login-professor', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'senha',
      passReqToCallback: true,
    },
    ((req, username, password, done) => {
      const conexaoDb = app.infra.banco.dbConnection();
      const usuarioDAO = new app.infra.banco.UsuarioDAO(conexaoDb);

      const entrada = {
        email: username,
        senha: password,
      };

      usuarioDAO.buscarProfessor(entrada, (err, usuario) => {
        if (err) {
          return done(err);
        }
        if (!usuario.length) {
          return done(null, false, req.flash('loginMessage', 'Oops! Email ou senha não encontrado, tente novamente.'));
        }
        if (!bcrypt.compareSync(entrada.senha, usuario[0].senha)) {
          return done(null, false, req.flash('loginMessage', 'Oops! Email ou senha não encontrado, tente novamente.'));
        }

        const user = usuario;
        user[0].tipo = 'professor';
        return done(null, user[0]);
      });

      conexaoDb.end();
    }),
  ));

  // Cadastro
  passport.use('local-signup-professor', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'senha',
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      const entrada = {
        email: username,
        senha: password,
      };

      const newUser = {
        email: username,
        instituicao_id: req.body.instituicao_id,
        nome: req.body.nome,
        endereco: req.body.endereco,
        cpf: req.body.cpf,
        cep: req.body.cep,
        numero: req.body.numero,
        telefone: req.body.telefone,
      };

      const user = {};

      const connDB = app.infra.banco.dbConnection();
      const UsuarioDAO = new app.infra.banco.UsuarioDAO(connDB);

      UsuarioDAO.buscarProfessor(entrada, (err, saida) => {
        if (err) return done(err);
        if (saida.length) {
          return done(null, false, req.flash('signupMessage', 'Email não disponivel'));
        }
        if (!saida.length) {
          bcrypt.genSalt((err1, salt) => {
            bcrypt.hash(entrada.senha, salt, (err2, hash) => {
              newUser.senha = hash;

              const connDB2 = app.infra.banco.dbConnection();
              const UsuarioDAO2 = new app.infra.banco.UsuarioDAO(connDB2);

              UsuarioDAO2.salvarProfessor(newUser, (err3, insertion) => {
                if (err3) {
                  console.log(err3);
                  return done(null, false, req.flash('signupMessage', 'Algum campo foi digitado invalidamente'));
                }
                user.id = insertion.insertId;
                user.tipo = 'professor';
                return done(null, user);
              });
              connDB2.end();
            });
          });
        }
        return null;
      });
      connDB.end();
    },
  ));
};

// sites relacionados com multiplas 'local-strategy'

// https://stackoverflow.com/questions/40411236/authorization-for-multiple-local-strategies-in-passportjs-using-mongodb-and-node
// https://stackoverflow.com/questions/36102524/passport-js-multiple-local-strategies-and-req-user
// https://stackoverflow.com/questions/20052617/use-multiple-local-strategies-in-passportjs
// https://github.com/jaredhanson/passport/issues/50
