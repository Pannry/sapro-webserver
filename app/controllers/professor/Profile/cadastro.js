module.exports = (app) => {
  const passport = app.get('passport');
  const Professor = {
    get: (req, res) => {
      const params = {
        message: req.flash('signupMessage'),
      };

      const conexaoDb = app.infra.banco.dbConnection();
      const instituicaoDAO = new app.infra.banco.InstituicaoDAO(conexaoDb);

      instituicaoDAO.listaInstituicao((err, resultado) => {
        if (err) throw err;
        params.listaDeInstituicao = resultado;
        res.render('professor/signup', params);
      });

      conexaoDb.end();
    },

    post: passport.authenticate('local-signup-professor', {
      successRedirect: '/professor/profile',
      failureRedirect: '/meu/link/secreto/para/cadastrar/o/professor/signup',
      failureFlash: true,
    }),
  };
  return Professor;
};
