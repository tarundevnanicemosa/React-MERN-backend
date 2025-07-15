const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');
// const { validationResult } = require('express-validator');

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne( {email: email} );
        
        if( usuario ){
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario existe con ese email'
            });
        }
        
        usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
        await usuario.save();

        //generar JWT
        const token = await generarJWT( usuario.id, usuario.name);
    
        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el admin'
        })
    }
}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne( {email: email} );
        
        if( usuario ){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //confirmar los passwords
        const validPassword = bcrypt.compareSync( password , usuario.password );
        
        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msg: 'Password incorrecto'
            });
        }

        //generar nuestro JWT
        const token = await generarJWT( usuario.id, usuario.name);

        res.status(200),json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el admin'
        })
    }
    
     //manejo de errores
    // const errors = validationResult( req );
    // if ( !errors.isEmpty() ){
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     });
    // }

    // res.json({
    //     ok:true,
    //     msg: 'login',
    //     email, 
    //     password
    // })
};

const revalidarToken = async(req, res = response) => {

    const { uid, name } = req;

    const token = await generarJWT( uid, name);
    
    res.status(200),json({
        ok:true,
        uid,
        name,
        token
    });


    res.json({
        ok:true,
        uid,
        name
    })
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}