module.exports = function () {
    return ExerciciosDao;
}

function ExerciciosDao ( conexaoDb ) {
    this._conexaoDb = conexaoDb;
}

/**
 * Professor
 */

/**
 * Exercicios
 */
ExerciciosDao.prototype.criarExercicios = function ( exercicio, callback ) {
    this._conexaoDb.query( 'INSERT INTO exercicios SET ?', exercicio, callback );
}

ExerciciosDao.prototype.listarExercicios = function ( id_professor, callback ) {
    this._conexaoDb.query( 'SELECT * FROM exercicios WHERE id_professor = ?', id_professor, callback );
}

ExerciciosDao.prototype.abrirExercicio = function ( id, callback ) {
    this._conexaoDb.query( 'SELECT * FROM exercicios WHERE id = ? AND id_professor = ?', [ id.id, id.id_professor ], callback );
}

/**
 * Lista de Exercicios
 */

ExerciciosDao.prototype.criarListaExercicios = function ( entrada, callback ) {
    this._conexaoDb.query( 'INSERT INTO lista SET ?', entrada, callback );
}

ExerciciosDao.prototype.mostrarListaExercicios = function ( entrada, callback ) {
    this._conexaoDb.query( 'SELECT * FROM lista WHERE id_professor = ?', entrada, callback );
}

ExerciciosDao.prototype.abrirLista = function ( entrada, callback ) {
    this._conexaoDb.query( 'SELECT * FROM lista WHERE id_professor = ? AND id = ?', [ entrada.id_professor, entrada.id ], callback );
}

ExerciciosDao.prototype.mostrarQuestoes = function ( entrada, callback ) {
    this._conexaoDb.query( 'SELECT * FROM lista_exercicios, exercicios WHERE ? ' +
        'AND lista_exercicios.id_exercicios = exercicios.id;', entrada, callback );
}

ExerciciosDao.prototype.adicionarExercicioLista = function ( entrada, callback ) {
    this._conexaoDb.query( 'INSERT INTO lista_exercicios SET ?', entrada, callback );
}

ExerciciosDao.prototype.ListasParaIncluir = function ( entrada, callback ) {
    this._conexaoDb.query( 'INSERT INTO sala_lista SET ?', entrada, callback );
}

ExerciciosDao.prototype.mostrarExerciciosInclusos = function ( entrada, callback ) {
    this._conexaoDb.query( 'SELECT id_sala, id_lista, id_professor, titulo, descricao ' +
        'FROM sala_lista, lista WHERE sala_lista.id_sala = ? AND sala_lista.id_lista = lista.id', entrada, callback );
}

ExerciciosDao.prototype.adicionarMaterial = function ( entrada, callback ) {
    this._conexaoDb.query( 'INSERT INTO exercicios_material set ?', entrada, callback );
}

ExerciciosDao.prototype.arquivosDownload = function ( id, callback ) {
    this._conexaoDb.query( 'SELECT file_name FROM exercicios_material WHERE id = ?', id, callback );
}

ExerciciosDao.prototype.fazerDownload = function ( id, callback ) {
    this._conexaoDb.query( 'select exercicios.id_professor, exercicios.id, exercicios_material.file_name from ' +
        'exercicios, exercicios_material where exercicios.id = ? and exercicios_material.file_name = ? and exercicios.id_professor = ?',
        [ id.id, id.file_name, id.id_professor ], callback );
}

/**
 *      Aluno
 */

ExerciciosDao.prototype.mostrarListasAluno = function ( entrada, callback ) {
    this._conexaoDb.query( 'SELECT id_sala, id_lista, titulo FROM sala_lista, lista ' +
        'WHERE sala_lista.id_sala = ? AND sala_lista.id_lista = lista.id;', entrada, callback );
}

ExerciciosDao.prototype.mostrarExerciciosAluno = function ( entrada, callback ) {
    this._conexaoDb.query( ' SELECT id_lista, id_exercicios, titulo FROM lista_exercicios, exercicios ' +
        'WHERE lista_exercicios.id_lista = ? AND lista_exercicios.id_exercicios = exercicios.id', entrada, callback );
}

ExerciciosDao.prototype.abrirRespostaAluno = function ( entrada, callback ) {
    this._conexaoDb.query( 'SELECT * FROM resposta WHERE id_exercicios = ? AND id_aluno = ? AND id_sala = ?',
        [ entrada.id_exercicios, entrada.id_aluno, entrada.id_sala ], callback );
}

ExerciciosDao.prototype.criarResposta = function ( entrada, callback ) {
    this._conexaoDb.query( 'INSERT INTO resposta SET ?', entrada, callback );
}

ExerciciosDao.prototype.responderExerciciosAluno = function ( entrada, callback ) {
    this._conexaoDb.query( 'UPDATE resposta SET resposta = ? WHERE id_aluno = ? AND id_exercicios = ? AND id_sala = ?',
        [ entrada.resposta, entrada.id_aluno, entrada.id_exercicios, entrada.id_sala ], callback );
}