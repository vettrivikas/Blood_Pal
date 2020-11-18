const BloodBankName=document.getElementById("BloodBankName");
const Address=document.getElementById("Address");
const Contact=document.getElementById("Contact");
const Email=document.getElementById("Email");
const Register=document.getElementById("Register");

Register.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(Email.value,Contact.value).then(function(){
        var id=firebase.auth().currentUser.uid;
        firebase.database().ref('Blood Bank/'+id+'/details/').set({
       bloodbank_name:BloodBankName.value,
       address:Address.value,
       contact:Contact.value,
       email:Email.value
    }).then(function(){
        alert("You are Registered Successfully!");
        window.location.href="Bloodbank.html";
    });

}) 
});