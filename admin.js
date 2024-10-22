const bodyParser = require('body-parser');
var express = require ('express')
var mysql = require('mysql')
var app = express();

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended : false}))

var con=mysql.createConnection({
    user:"root",
    password:"",
    database:"todolist",
    host:"localhost"
})

con.connect();

app.get('/',function(req,res){
    res.render("admin_login")
})

app.post('/',function(req,res){
    var login_admin = "select * from admin  where a_email='"+req.body.email+"' and a_password='"+req.body.password+"'";

    con.query(login_admin,function(error,result){
        if(error) throw error;

        if(result.length==1){
            res.redirect('/dashboard');
        }else{
            res.redirect('/');
        }
    })
})

app.get('/dashboard',function(req,res){
    res.render("admin_dashboard")
})

app.get('/add_user',function(req,res){
    res.render("add_user")
})

app.post('/add_user',function(req,res){
    var add_user = "insert into user(u_name,u_email,u_password)values('"+req.body.name+"','"+req.body.email+"','"+req.body.password+"')";

    con.query(add_user,function(err,result){
        if(err) throw err;
        res.redirect("/add_user");
    })
})

app.get('/add_task',function(req,res){

    var select_user = "select * from user";

    con.query(select_user,function(err,result){
        if(err) throw err;
        res.render("add_task",{result})
        
    })

})

app.post('/add_task',function(req,res){

    var add_task = "insert into add_task(user_id,task)values('"+req.body.user+"','"+req.body.task+"')";

    con.query(add_task,function(error,result){
        if(error) throw error;
        res.redirect("/add_task");
    })
})

app.get('/view_task',function(req,res){
    var select_task = "SELECT user.u_name , add_task.task_id , add_task.task , add_task.status FROM add_task INNER JOIN user on user.u_Id = add_task.user_id;";

    con.query(select_task,function(error,result){
        if(error) throw error;
        res.render("view_task",{result});
    })
})

// app.get('/manage_task',function(req,res){
//     res.render("manage_task")
// })
app.get('/manage_task',function(req,res){
    var select_task = "SELECT user.u_name , add_task.task_id , add_task.task , add_task.status FROM add_task INNER JOIN user on user.u_Id = add_task.user_id;";

    con.query(select_task,function(error,result){
        if(error) throw error;
        res.render("manage_task",{result});
    })
})

// app.get('/delete/:task_id',function(req,res){
//     var id = req.params.task_id;
//     var delete_task = "delete from add_task where task_id="+id;
//     console.log("aaaaaa"); 
//     con.query(delete_task,function(err,result){
//         if(err) throw err;
//         res.redirect("add_task",{result});
//     })                          
// })

app.get('/delete/:id',function(req,res){
    var delete_query = "delete from add_task where id='"+req.params.task_id+"'";
    con.query(delete_query,function(err,result){
    if(err) throw err;
    res.redirect("manage_task",{result});
})
})

app.listen(3001);
