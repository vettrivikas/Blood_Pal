window.onload=LoadFunction();
function LoadFunction(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user)
        {

          var date=new Date();
          var current_Date=(date.getMonth()+1)/date.getDate()/date.getFullYear();  
          var today=current_Date;
          id=firebase.auth().currentUser.uid;
          var app = new Vue({
            el: '#apps',
            data: {
              scanner: null,
              activeCameraId: null,
              cameras: [],
              scans: []
            },
            mounted: function () {
              var self = this;
              self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
              self.scanner.addListener('scan', function (content, image) {
                self.scans.unshift({ date: +(Date.now()), content: content });
                console.log(content);
                var fname=document.getElementById('fname');
                var lname=document.getElementById('lname');
                var gender=document.getElementById('gender');
                var contact=document.getElementById('contact');
                var email=document.getElementById('email');
                var bg=document.getElementById('bloodgroup');
                var clear=document.getElementById('clear');
                firebase.database().ref().child('donors/'+content+'/details/').once('value',function(snap){
                    var val=snap.val();
                    var f=val.first_name;
                    var l=val.last_name;
                    var g=val.gender;
                    var c=val.mobile;
                    var e=val.email;
                    var b=val.blood_group;
                    
                    fname.value=f;
                    lname.value=l;
                    gender.value=g;
                    contact.value=c;
                    email.value=e;
                    bg.value=b;

                });
                clear.addEventListener('click',(e)=>{
                    fname.value='';
                    lname.value='';
                    gender.value='';
                    contact.value='';
                    email.value='';
                    bg.value='';
                });
              });
              Instascan.Camera.getCameras().then(function (cameras) {
                self.cameras = cameras;
                if (cameras.length > 0) {
                  self.activeCameraId = cameras[0].id;
                  self.scanner.start(cameras[0]);
                } else {
                  console.error('No cameras found.');
                }
              }).catch(function (e) {
                console.error(e);
              });
            },
            methods: {
              formatName: function (name) {
                return name || '(unknown)';
              },
              selectCamera: function (camera) {
                this.activeCameraId = camera.id;
                this.scanner.start(camera);
              }
            }
          });
        }
      })
    }

