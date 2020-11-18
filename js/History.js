window.onload=LoadFunction();
function LoadFunction(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user)
        {
          id=firebase.auth().currentUser.uid;
          console.log(id);
    
          var i=1;
          firebase.database().ref('Volunteers/'+id+'/Camp History').once("value",function(snapshot){
            if(snapshot.exists()){
              var content='';
              snapshot.forEach(function(data){
                var val=data.val();
                var key=data.key;
                
                content +='<tr>';
                content +='<td>'+i+'</td>';
                i++;
                content +='<td class="key">'+key+'</td>';
                content +='<td>'+val.campDate+'</td>';
                content +='<td>'+val.campArea+'</td>';
                content +='<td>'+val.No_of_Donors+'</td>';
                content +='</tr>'
              });
              
              $('#historyTable').append(content);
         }
          });
          firebase.database().ref('Volunteers/'+id+'/Camp History').once("value",function(snapshot){
            if(snapshot.exists()){
              var content='';
              snapshot.forEach(function(data){
                var val=data.val();
                var key=data.key;
                const date=new Date();
                const current_date=(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();  
                var fetched_date=val.campDate;
                console.log(current_date)
                console.log(fetched_date);
                if(current_date==fetched_date)
                {
                  content+='<option>'+key+'</option>';
                }
              });
              $('#campid').append(content);
            }
          });
                  
        }
        else
        {
          console.log("error");  
        }
      });
};
