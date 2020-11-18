const uname=document.getElementById("Username");
const pass=document.getElementById("Password");
const regBtn=document.getElementById("Register");

regBtn.addEventListener('click', (e) => {
    e.preventDefault();
firebase.auth().signInWithEmailAndPassword(uname.value,pass.value).then(function(){
    var id=firebase.auth().currentUser.uid;
    window.location.replace("volunteer_home.html");
    localStorage.setItem('id',id);
    localStorage.setItem('uname',uname.value);
    localStorage.setItem('pass',pass.value);
   }).catch(error=>
    {
        const errorCode=error.code;
        if(errorCode === 'auth/invalid-email')
        {
            alert('Invalid Username and Password');
            uname.value='';
            pass.value='';
        }
        else
        {
            alert('invalid password');
            pass.value='';
        }
    })
});
