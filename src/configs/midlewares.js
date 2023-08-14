module.exports.flashMiddleware = function(req, res, next){


    res.locals.flash = req.flash('message_flash');

    next();
}