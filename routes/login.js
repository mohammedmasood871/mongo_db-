var mongoose = require('mongoose');
module.exports = function(app,passport) {

// landing page route
    app.get('/', (req,res) =>{
      
        res.render('hero.ejs')
    })
    // landing page route


// login page route
app.get('/login', (req,res) =>{
    res.render('login.ejs', { message: req.flash('loginMessage') })
})


// login page route

// login post call

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));


// login post call


// dashboard get  call 

app.get('/dashboard',isLoggedIn, (req,res) =>{
    req.db.get('slot').find({ $and: [{ stud_id: req.user._id ,request:"pending"}] } , {}, (e,data) =>{
        console.log(data.length)
        res.render('dashboard.ejs', {date: new Date().toISOString().split('T')[0], name:req.user.name, message: req.flash('message'), id:req.user._id,data:data.length,superadmin:req.user.superAdmin
    })

    })
})


// dashboard get call end


// slot post call

app.post('/slot', isLoggedIn,(req,res) =>{
    var data = {
        name:req.body.name,
        date:new Date(req.body.date),
        time:req.body.time,
        stud_id: mongoose.Types.ObjectId(req.body.stud_id),
        request: "pending"

    }
req.db.get('slot').insert(data, (e, data) =>{
    console.log(data)
    req.flash('message', 'Slot booked Sucessfully please wait for confirmation')
    res.redirect('/dashboard')
})

})



// slot post call

// slot list call
app.get('/slotlist', isLoggedIn, (req,res) =>{
    req.db.get('slot').find({ $and: [{ stud_id: req.user._id }] } , {}, (e,data) =>{
        console.log(data)
        res.render('slotlist.ejs', {superadmin:req.user.superAdmin,date: new Date().toISOString().split('T')[0], name:req.user.name, message: req.flash('message'), id:req.user._id,data:data})

    })

})


// slot list call 
// alumni list call
app.get('/alumnilist', isLoggedIn, (req,res) =>{
    req.db.get('slot').find({  } , {}, (e,data) =>{
        console.log(data)
        res.render('alumnilist.ejs', {message:req.flash('message'),superadmin:req.user.superAdmin,date: new Date().toISOString().split('T')[0], name:req.user.name, message: req.flash('message'), id:req.user._id,data:data})

    })

})


// alumni list call end

// alummi update approve call 
app.post('/approve', isLoggedIn, (req, res) =>{
    req.db.get('slot').update({ _id:req.body.stud } , {$set:{request:"approved"}}, {new:true}, (e,data) =>{
        req.flash('message', 'Approved Successfully')

        res.redirect('/alumnilist')
    })

})
app.post('/reject', isLoggedIn, (req, res) =>{
    req.db.get('slot').update({ _id:req.body.stud } , {$set:{request:"reject"}}, {new:true}, (e,data) =>{
        req.flash('message', 'Rejectd Successfully')
        res.redirect('/alumnilist')
    })

})

//  alumni update approve call 


//log out
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
//   log out

}
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}