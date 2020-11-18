const OrganisationId=document.getElementById("OrganisationId");
const OrganisationName=document.getElementById("OrganisationName");
const Address=document.getElementById("Address");
const Contact=document.getElementById("Contact");
const Email=document.getElementById("Email");
const Register=document.getElementById("Register");


Register.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(Email.value,Contact.value).then(function(){
        var id=firebase.auth().currentUser.uid;
        firebase.database().ref('Volunteers/'+id+'/details').set({
       organisation_name:OrganisationName.value,
       contact:Contact.value,
       email:Email.value
    }).then(function(){
      alert("You are Registered Successfully!");
      window.location.href="volunteer.html";
    });
  })
});