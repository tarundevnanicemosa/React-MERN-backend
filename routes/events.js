const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const router = Router();

//todas tienen que pasar por la validacione del JWT
router.use( validarJWT );

//obtener eventos
router.get('/', getEventos)

//crear un nuevo evento
router.post(
    '/', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatorio').custom( isDate ),
        validarCampos
    ], 
    crearEvento 
);

//actualizar evento
router.put('/:id', actualizarEvento );

//borrar evento
router.delete('/:id', eliminarEvento );

module.exports = router;