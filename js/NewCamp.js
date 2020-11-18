firebase.auth().onAuthStateChanged(function(user){
if(user)
{
    id=firebase.auth().currentUser.uid;
    console.log(id);
    const CampDate=document.getElementById("CampDate");
    const CampArea=document.getElementById("CampArea");
    const Address=document.getElementById("Address");
    const Contact=document.getElementById("Contact");
    const RegBtn=document.getElementById("Register");

    RegBtn.addEventListener('click', (e) => {
        e.preventDefault();
        var ref=firebase.database().ref('Volunteers/'+id+'/Camp History/');
        ref.once('value',function(snap){
            var count=snap.numChildren();
            var node=parseInt(count)+1;
            ref.child('camp'+node).set
            ({
                campArea: CampArea.value,
                campDate: CampDate.value,
                contact: Contact.value,
                address: Address.value,
                No_of_Donors:0,
            });           
        }).then(function(){
            CampDate.value="";
            CampArea.value="";
            Contact.value="";
            Address.value="";
            alert("New camp Registered");
        });
    })
}
else
{
    console.log("User state check pannunga thambi");  
}
});