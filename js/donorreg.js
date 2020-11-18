firebase.auth().onAuthStateChanged(function(user){
  if(user)
  {
    var vid=firebase.auth().currentUser.uid;
    //get the user details by ID

    const UniqueId=document.getElementById("UniqueId");
    const FirstName=document.getElementById("FirstName");
    const LastName=document.getElementById("LastName");
    const BloodGroup=document.getElementById("BloodGroup");
    const Gender=document.getElementById("Gender");
    const DateOfBirth=document.getElementById("DateOfBirth");
    const Mobile=document.getElementById("Mobile");
    const Email=document.getElementById("Email");
    const addBtn=document.getElementById("addBtn");

    //getting the current date

    const date=new Date();
    const current_Date=(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();  
    var id;

    //starts when the Register button clicked

    addBtn.addEventListener('click', (e) => 
    {
      e.preventDefault();
      //create the user

      firebase.auth().createUserWithEmailAndPassword(Email.value,DateOfBirth.value).then(function(){
        //get the uid of the created user

        id=firebase.auth().currentUser.uid;
        console.log(id);
        //saves the user date in database using uid as node

      firebase.database().ref('donors/'+id+'/details/').set( {
          first_name:FirstName.value,
          last_name:LastName.value,
          blood_group:BloodGroup.value,
          gender:Gender.value,
          mobile:Mobile.value,
          dob:DateOfBirth.value,
          email:Email.value,
          first_date:current_Date
      });
        var vkey=localStorage.getItem('key');
        firebase.database().ref('Volunteers/'+vid+'/Camp History/'+vkey+'/').once('value',function(snap1)
        {
          console.log(vkey);
          var val=snap1.val();
          var donorcount=val.No_of_Donors;
          var count=donorcount+1;
          firebase.database().ref('Volunteers/'+vid+'/Camp History/'+vkey+'/').update({No_of_Donors:count});
          var camparea=val.campArea;
          firebase.database().ref('donors/'+id+'/history/1/').set({
            date:current_Date,
            campArea:camparea,
            campId:vkey,
          });        
        });
      //clears the input field after the values stored
      UniqueId.value=id;
      FirstName.value="";
      LastName.value="";
      BloodGroup.value='Blood Group';
      Gender.value='Gender';
      DateOfBirth.value='';
      Mobile.value='';
      Email.value='';
      alert("Successfully added");
      console.log(localStorage.getItem('uname'),localStorage.getItem('pass'));
      //signout from the logined user account
          firebase.auth().signOut().then(function()
          {
            console.log('Existing donor signout');
            firebase.auth().signInWithEmailAndPassword(localStorage.getItem('uname'),localStorage.getItem('pass')).then(function(){  
            });
          });
      }).catch(error => 
      {    
        const errorCode=error.code;
        if(errorCode === 'auth/email-already-in-use')
        {
          firebase.auth().signOut().then(function()
          {
            console.log('volunteer logout !');
            firebase.auth().signInWithEmailAndPassword(Email.value,DateOfBirth.value).then(function()
            {
              var id=firebase.auth().currentUser.uid;
              console.log('donor sign in !');
              var ref=firebase.database().ref('donors/'+id+'/history/');
              ref.limitToLast(1).once('child_added',function(snap)
              {
                var lastdonation=snap.key;
                console.log(lastdonation);
                firebase.database().ref('donors/'+id+'/history/'+lastdonation+'/').limitToLast(1).once('value',function(snap1)
                {
                  var val=snap1.val();
                  var Fetched_Date=val.date;
                  console.log(Fetched_Date);
                  var dateCount=Math.floor(( Date.parse(current_Date) - Date.parse(Fetched_Date) ) / 86400000);
                  console.log(dateCount);
                  if(dateCount<=90)
                  {
                    console.log('less than 90');
                    alert('Donor not allowed to donate. As the donor donate before '+dateCount+' days only.');
                    FirstName.value="";
                    LastName.value="";
                    BloodGroup.value='Blood Group';
                    Gender.value='Gender';
                    DateOfBirth.value='';
                    Mobile.value='';
                    Email.value='';
                  }
                  else
                  {
                    console.log('greated than 90');
                    var currentdonation=parseInt(lastdonation)+1;                    
                      var lastcamp=localStorage.getItem('key');
                      firebase.database().ref('Volunteers/'+vid+'/Camp History/'+lastcamp+'/').once('value',function(snap3)
                      {
                        var val=snap3.val();
                        var donorcount=val.No_of_Donors;
                        var count=donorcount+1;
                        firebase.database().ref('Volunteers/'+vid+'/Camp History/'+lastcamp+'/').update({No_of_Donors:count});
                        var camparea=val.campArea;
                        console.log(lastcamp);
                        firebase.database().ref('donors/'+id+'/history/'+currentdonation+'/').set({
                          campId:lastcamp,
                          campArea:camparea,
                          date:current_Date,
                        });
                        alert('Donor status Updated !.');
                        UniqueId.value=id;
                        FirstName.value="";
                        LastName.value="";
                        BloodGroup.value='Blood Group';
                        Gender.value='Gender';
                        DateOfBirth.value='';
                        Mobile.value='';
                        Email.value='';
                      });                      
                  }
                });
              });
              firebase.auth().signOut().then(function()
              {
                console.log('donor signout !');
                firebase.auth().signInWithEmailAndPassword(localStorage.getItem('uname'),localStorage.getItem('pass')).then(function(){  
                  console.log('owner logged in');
                });
              });
            });  
          });
        }
      });
    });   
  }
});
