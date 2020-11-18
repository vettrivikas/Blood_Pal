window.onload=LoadFunction();
function LoadFunction(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user)
        {

          const date=new Date();
          const current_Date=(date.getMonth()+1)+" "+date.getDate()+" "+date.getFullYear();  
          const today=current_Date;
          id=firebase.auth().currentUser.uid;
          var app = new Vue({
            el: '#app',
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
                console.log(today);
                var ref=firebase.database().ref("Blood Bank/"+id+"/"+today+"/");
                firebase.database().ref("Blood Bank/"+id+"/"+today+"/").once('value',function(snap){
                  var count=snap.numChildren()+1;
                  ref.update({
                  [count]:content,
                  }).then(function(){
                    console.log(content);
                    alert("Scanned");
                  });
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

