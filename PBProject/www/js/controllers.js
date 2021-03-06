var app = angular.module('app.controllers', [])
  
app.controller('pageCtrl', function($scope,$http) {
    initialize();
    var myArray = [];
    var imageCounterVariable = 0;
   
    $scope.Location = function()
    {
        initialize();
        $http({
            method: 'get',
            url : 'https://api.mongolab.com/api/1/databases/pbproject/collections/location?apiKey=W2z70cG1M_G7EHKg6GfCT-EXK3zJMIpM',
            find: JSON.stringify({
            }),
            contentType: "application/json"
        }).success(function(sourcedata) {

            var myArrayX = [];
            var myArrayY = [];

            for(var i=0;i<sourcedata.length;i++)
            {   
                if(sourcedata[i].locationCount >100 || sourcedata[i].locationCount ==1 )
                    continue;
                myArrayX[i] = sourcedata[i].location; 
                myArrayY[i] = sourcedata[i].locationCount;
            }   
            graph(myArrayX,myArrayY);  
            function graph(myArrayX,myArrayY)
            {

                var data = [
                    {
                        x:myArrayX,
                        y:myArrayY,
                        color:'red',
                        type:'bar'
                    }];
                var layout = {
                                        title: 'Location of tweet',
                                        showlegend: false,
                                        height: 500,
                                        width: 900
                            };
                Plotly.newPlot('imageArea', data,layout);  
            }
        })
    }

    $scope.Source = function()
    {
        initialize();
        $http({
            method: 'get',
            url : 'https://api.mongolab.com/api/1/databases/pbproject/collections/TweetSource?apiKey=W2z70cG1M_G7EHKg6GfCT-EXK3zJMIpM',
            find: JSON.stringify({
            }),
            contentType: "application/json"
        }).success(function(sourcedata) {

            var myArrayX = [];
            var myArrayY = [];

            for(var i=0;i<sourcedata.length;i++)
            {  
                var sourcePoint = sourcedata[i].source.search("\">");
                var endPoint = sourcedata[i].source.search("</a");
                var dataToPush= sourcedata[i].source.substring(sourcePoint+2,endPoint);
                
                myArrayX[i] = dataToPush; 
                myArrayY[i] = sourcedata[i].count;
            }   
            graph(myArrayX,myArrayY);  
            function graph(myArrayX,myArrayY)
            {
                var data = [
                    {
                        x:myArrayX,
                        y:myArrayY,
                        type:'scatter'
                    }];
                var layout = {
                    title: 'Source of tweet',
                    height: 500,
                    width: 900
                };
                Plotly.newPlot('imageArea', data,layout);
            }   
        })  
        .error(function(){
               alert("Error in Source Data");
               })
               
  }
    
    $scope.Language = function()
    {
        initialize();
        $http({
            method: 'get',
            url : 'https://api.mongolab.com/api/1/databases/pbproject/collections/language?apiKey=W2z70cG1M_G7EHKg6GfCT-EXK3zJMIpM',
            find: JSON.stringify({
            }),
            contentType: "application/json"
        }).success(function(sourcedata) {
            
            var myArrayX = [];
            var myArrayY = [];

            for(var i=0;i<sourcedata.length;i++)
            {   
                myArrayX[i] = sourcedata[i].language; 
                myArrayY[i] = sourcedata[i].count;
            }   
            graph(myArrayX,myArrayY);  
            function graph(myArrayX,myArrayY)
            {
                var data = [
                    {
                        x:myArrayX,
                        y:myArrayY,
                        mode:'markers',
                        grid:false,
                        marker: {
                            color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
                            opacity: [1, 0.8, 0.6, 0.4],
                            size:[50,40,30,20,10]
                        }
                    }];
                var layout = {
                    title: 'Top 5 languages of tweets',
                    showlegend: false,
                    height: 500,
                    width: 900
                };
                Plotly.newPlot("imageArea", data,layout);  
            }   
        });  
    }
    
    $scope.Coordinate = function()
    {      
        var MapOptions = {
            zoom: 2,
            center: new google.maps.LatLng(36,3),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        
        $scope.map = new google.maps.Map(document.getElementById('imageArea'),MapOptions);
        $scope.Markers = [];
        var infoWindow = new google.maps.InfoWindow();
        function createMarker(info){
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.coordinates[0], info.coordinates[1]),
                title: info.text
            });
            marker.content = '<div class="infoWindowContent">' + info.text + '</div>';
            google.maps.event.addListener(marker, 'mousedown', function(){
                //infoWindow.setContent('<h6>' + marker.title + '</h6>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
            $scope.Markers.push(marker);
        }  
        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }

        $http({
            method: 'get',
            url : 'https://api.mongolab.com/api/1/databases/pbproject/collections/Geo-location?apiKey=W2z70cG1M_G7EHKg6GfCT-EXK3zJMIpM',
            find: JSON.stringify({
            }),
            contentType: "application/json"
        }).success(function(sourcedata) {
            for(var i=0;i<sourcedata.length;i++)
            {   
                createMarker(sourcedata[i]);
            }   
        });  
    }
    
    $scope.Retweet = function()
    {  
        initialize();
        $http({
            method: 'get',
            url : 'https://api.mongolab.com/api/1/databases/pbproject/collections/Favourites?apiKey=W2z70cG1M_G7EHKg6GfCT-EXK3zJMIpM',
            find: JSON.stringify({
            }),
            contentType: "application/json"
        }).success(function(sourcedata) {

            var myArrayy1 = [];
            var myArrayy2 = [];
            var myArrayx = [];

            for(var i=0;i<sourcedata.length;i++)
            {   
                myArrayy1[i] = sourcedata[i].favourites_count;
                myArrayy2[i] = sourcedata[i].retweet_count;
                myArrayx[i] = sourcedata[i].followers_range;
            }   
            graph(myArrayx,myArrayy1,myArrayy2);

            function graph(myArrayx,myArrayy1,myArrayy2)
            {
                var Favorites_Count = {
                    x: myArrayx,
                    y: myArrayy1,
                    type: 'scatter',
                    name:'Favorites_Count'
                };
                var Retweet_Count = {
                    x: myArrayx,
                    y: myArrayy2,
                    type: 'scatter',
                    name:'Retweet_Count'
                };
                var data = [Favorites_Count, Retweet_Count];
                var layout = {
                    title: 'Retweets and Favourites',
                    showlegend: true,
                    height: 500,
                    width: 900
                };
                Plotly.newPlot('imageArea', data, layout);
            }
        });  
    }

    $scope.TimeZone = function()
    {
        $http({
            method: 'get',
            url : 'https://api.mongolab.com/api/1/databases/pbproject/collections/TimeZone?apiKey=W2z70cG1M_G7EHKg6GfCT-EXK3zJMIpM',
            find: JSON.stringify({
            }),
            contentType: "application/json"
        }).success(function(sourcedata) {

            var myArrayX = [];
            for(var i=0;i<sourcedata.length;i++)
            { 
                myArrayX.push({           
                    label: sourcedata[i].time_zone,
                    value:sourcedata[i].count
                })
            }
            graph(myArrayX);
            function graph(myArrayX)
            {
                Morris.Donut({ 
                    element: 'imageArea',
                    data: myArrayX,
                    labelColor: '#060',
                    colors: [
                        'rgb(69, 113, 64)',
                        'rgb(18, 18, 18)',
                        '#67bbc6',
                        '#abe3e3'
                    ],
                });
            }   
        });  
    }

    $scope.Hashtag = function()
    {
        initialize();
        $http({
            method: 'get',
            url : 'https://api.mongolab.com/api/1/databases/pbproject/collections/daywise?apiKey=W2z70cG1M_G7EHKg6GfCT-EXK3zJMIpM',
            find: JSON.stringify({
            }),
            contentType: "application/json"
        }).success(function(sourcedata) {

            var myArrayX = [];
            var myArrayY = [];
            for(var i=0;i<sourcedata.length;i++)
            { 
                myArrayX[i] = sourcedata[i].Day; 
                myArrayY[i] = sourcedata[i].count;
            }
            graph(myArrayX,myArrayY);
            function graph(myArrayX,myArrayY)
            {
                var data = [
                    {
                        x:myArrayX,
                        y:myArrayY,
                        type:'bar'
                    }];
                var layout = {
                    title: 'Count of tweets day wise',
                    showlegend: false,
                    height: 500,
                    width: 900
                };

                Plotly.newPlot('imageArea', data,layout);
            }   
        });  
    }
    
    $scope.Picture = function()
    {
        document.getElementById('next').classList.remove('hide');
        document.getElementById('previous').classList.remove('hide');
        document.getElementById("imageArea").innerHTML = "";
        
        $http({
            method: 'get',
            url : 'https://api.mongolab.com/api/1/databases/pbproject/collections/imageTable?apiKey=W2z70cG1M_G7EHKg6GfCT-EXK3zJMIpM',
            find: JSON.stringify({
            }),
            contentType: "application/json"
        }).success(function(sourcedata) {
            for(var i=0;i<sourcedata.length;i++)
            { 
                myArray.push({           
                    ScreenName:sourcedata[i].screen_name,
                    Location: sourcedata[i].location,
                    URL: sourcedata[i].profile_image_url_https
                })
            }
            document.getElementById("imageArea").innerHTML =innerHTML(imageCounterVariable);
        });
    }

    function innerHTML(counter){
        return "<div class=col><img id='forecast_embed' width='250' height='245' src='"+myArray[counter].URL+"'></img><p>Screen Name            :"+myArray[counter].ScreenName+"</p><p>Location  :"+myArray[counter].Location+"</p></div><div class=col><img id='forecast_embed' width='250' height='245' src='"+myArray[counter+1].URL+"'></img><p>Screen Name  :"+myArray[counter+1].ScreenName+"</p><p>Location  :"+myArray[counter+1].Location+"</p></div><div class=col><img id='forecast_embed' width='250' height='245' src='"+myArray[counter+2].URL+"'></img><p>Screen Name   :"+myArray[counter+2].ScreenName+"</p><p>Location :"+myArray[counter+2].Location+"</p></div>"
    }
    
    $scope.PreviousImage = function()
    {
      if(imageCounterVariable==0)
      {
         imageCounterVariable=myArray.length-1;
      }
        imageCounterVariable-= 3;
        document.getElementById("imageArea").innerHTML =innerHTML(imageCounterVariable);
    }
    
   $scope.NextImage = function()
    {
       if(imageCounterVariable==myArray.length-1)
       {
          imageCounterVariable=0;
       }
       imageCounterVariable+=3;
       document.getElementById("imageArea").innerHTML =innerHTML(imageCounterVariable);
    }
   
    function initialize()
    {
        document.getElementById("imageArea").innerHTML = "";
        document.getElementById('next').classList.add('hide');
        document.getElementById('previous').classList.add('hide');
    }
    
})
