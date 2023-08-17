

exports.signout = function(req, res){
    req.logOut();
    req.flash('message_flash', {type: 'success', message: 'Logged out'})
    return res.redirect('/signin');
}