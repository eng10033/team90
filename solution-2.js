
// This file contains some delegate classes for you to extend.
 
function NewRoutePageControllerDelegate()
{
	// Save 'this' so we can refer to public attributes and methods.
	var self = this;
 
	// The MapPageController class controls the 'New Route' page.
	// This class provides a couple of useful methods:
	// 	displayMessage(message):
	//     	Causes a short message string to be displayed on the
	//     	page for a brief period.  Useful for showing quick
	//     	notifications to the user.
	// 	panToLocation(latitude, longitude):
	//     	Pans the map to the given latitude and longitude.
	// 	repaintOverlay():
	//     	Causes the map overlay to be redrawn, triggering a
	//     	call to our mapPageDrawOverlay() method.  You might
	//     	wish to call this when you update information that
	//     	is displayed on the canvas overlay.
	// 	canvasPointFromLocation(latitude, longitude):
	//     	Given a latitude and longitude, returns the
	//     	corresponding point on the canvas overlay.
	//     	The return value is an object with an 'x' and a 'y'
	//     	property.
	var newRoutePageController = null;
 
	// NOTE: You should not remove any of the five public methods below.
 
	// This method is called by the MapPageController when the user
	// has switched to the page and it has been intialised.
   	
 	
    this.mapPageInitialisedWithOptions = function(controller, options)
	{
        console.log("Record Route - mapPageInitialisedWithOptions");
        newRoutePageController = controller;
            
          // Calling our mapPageDrawOverlay() method 
         //  to draw the current position onto the map
            controller.repaintOverlay();
    	
                    	
            }
 
	// The MapPageController calls this when loading its page.
	// You should return an array of objects specifying buttons you
	// would like to display at the bottom of the map, e.g.,
	//	{
	//    	title:   "Start",
	//    	id:      "startButton",  (optional)
	//	}
	// Note: This doesn't support an "onClick" property like in
	// Assignment 1.
    this.mapPageButtonControls = function()
	{
        console.log("Record Route - mapPageButtonControls");
             // Creating the start tracking button and the end tracking button
    	var start = { title:"Start Tracking",id:"startButton",}
    	var end =   { title:"End Tracking", id:"EndButton",}
    	return [start,end];
	}
 
	// The MapPageController calls this when user taps on a button
	// specified by mapPageButtonControls().  The buttonIndex will
	// be the index of the button in the aray you returned.
    this.mapPageButtonTapped = function(buttonIndex)
	{
        console.log("Record Route - mapPageButtonTapped(" + buttonIndex + ")");
           //Start button is clicked
    	if (buttonIndex == 0) 
    	{
           //An empty array to save the locations
           //The array will be cleared when the start button is clicked again
        	self.newRoute=[]  
            self.trackingEnabled = true
            newRoutePageController.displayMessage ("Tracking Enabled")
           //Saving the initial recoeding time
            self.startTime = Date.now()
           //Calling mapPageDrawOverlay() method to draw on the map
            newRoutePageController.repaintOverlay()
    	}

           //When the end tracking button is clicked
    	if(buttonIndex == 1) 
    	{
            self.trackingEnabled = false
            newRoutePageController.displayMessage("Tracking Disabled")
                                // Naming the recorded route
                                	var routeName = prompt("Enter route name","")
                                	//Saving the end time of recording
                                  self.endTime = Date.now()
                                  //Computing the total distance, time taken and the avarage speed
                                	var millisecondsToHoursFactor = 3600000
                                	var totalTime = (self.endTime -           self.startTime)/millisecondsToHoursFactor
                                	var totalDistance = localStorage.getItem("totalDistance")
                                	var totalDistanceKM = totalDistance/1000
                                	var speed = (totalDistanceKM/totalTime)
                                  //Converting data to JSON
                                  //Saving to the local storage 
                                	var storageValue = JSON.stringify({dateCreated: routeName,  locations: self.newRoute, distance: totalDistance, speed: speed})
                                	console.log(storageValue)
                                	localStorage.setItem("route-" + Date.now(),storageValue)
           //Calling mapPageDrawOverlay() method to draw on the map
            newRoutePageController.repaintOverlay()
    	}
	}
 
	// The MapPageController calls this when the canvas needs to be
	// redrawn, such as due to the user panning or zooming the map.
	// It clears the canvas before calling this method.
	// 'context' is an HTML canvas element context.  This is a
	// transparent layer that sits above the map and is redrawn
	// whenever the map is panned or zoomed. It can be used to
    	// draw annotations on the map or display other information.
 
    this.mapPageDrawOverlay = function(context)
	{
           // Save 'this' so we can refer to public attributes and methods.
    	var self = this

           // Let the application get the best possible GPS results
    	self.option = {
                                                enableHighAccuracy: true,
                                                timeout: 6000,
                                                maximumAge: 1000,
                      }

           //Error message to console
    	self.error = function(err)
                    	    	{
                        console.warn('ERROR(' + err.code + '): ' + err.message);
            	}
                    	
                    	
 
    	self.position = function(position)
    	{		
	//Pans the map to the given latitude and longitude	
            newRoutePageController.panToLocation(position.coords.latitude, position.coords.longitude)
            //returns the corresponding point on the canvas overlay
    	var canvascoodinates = newRoutePageController.canvasPointFromLocation(position.coords.latitude,position.coords.longitude)
            	
                       //Draw on the canvas
                        context.fillStyle = "rgba(0,0,255,1)";
         	            context.beginPath();
                        context.arc(canvascoodinates.x,canvascoodinates.y,1,0,2*Math.PI);
                        context.fill();	
     //Drawing outside circle to show the accuracy level 
                        context.fillStyle = "rgba(0,0,255,0.1)";
                        context.beginPath() ;
context.arc(canvascoodinates.x,canvascoodinates.y,position.coords.accuracy,0,2*Math.PI)
                        context.fill();
	
                       }
       //Get the current position of the device
         navigator.geolocation.getCurrentPosition(self.position,self.error,self.option)
 
   	    function continueOn()
				{
					if (self.newRoute.length > 2) /* If there are at least three objects in the self.newRoute array, this function checks to see if the gps location is at least ten meters from the last saved position, and does not save it in the self.newRoute array unless it is */
					{
                                                                     //Geo measurement function
						function measure(lat1, lon1, lat2, lon2)
							{  
                                                                          // Radius of earth in KM
						var earthRadius= 6378.137; 							var changeLat = (lat2 - lat1) * Math.PI / 180;
							var changeLon = (lon2 - lon1) * Math.PI / 180;
							var a = Math.sin(changeLat/2) * Math.sin(changeLat/2) +
							Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
							Math.sin(changeLon/2) * Math.sin(changeLon/2);
							var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
							var d = earthRadius * c;
                                                                                  // In meters
							return d * 1000;
							}
						if (measure(self.newRoute[self.newRoute.length-2].latitude, self.newRoute[self.newRoute.length-2].longitude, self.newRoute[self.newRoute.length-1].latitude, self.newRoute[self.newRoute.length-1].longitude) < 10)
						{
							self.newRoute.pop()
							return
						}
						else
						{
							return
						}
					}
					else
					{
						return
					}
				}
		
    	//When the tracking is enabled
    	if (self.trackingEnabled == true)
    	{ 
            self.drawOnCanvas = function(position)
        	{	
            	var latitude = position.coords.latitude                                           	
            	var longitude= position.coords.longitude
     
            //Saving the location in a position object
            var position ={latitude: latitude, longitude:longitude} 			
                      //Save a new position to the array
	            self.newRoute.push(position)
			
//Calling our continueOn() method to 
			    continueOn()
				
						
				
	//Saving newRoute to Local Storage 			
                localStorage.setItem("distancePath", JSON.stringify(self.newRoute))
                                            	console.log(JSON.stringify(self.newRoute))
                //Array storing canvas coordinates of each position from this.newRoute array
                var canvasCoordinatesArray = [] 

                // Converting each position in the newRoutes array to coordinate form
            	for (i=0; i<self.newRoute.length; i++) 
            	{
                    var getCoordinates = newRoutePageController.canvasPointFromLocation(self.newRoute[i].latitude,self.newRoute[i].longitude)
                    //Saving the coordinates in a position object
                    var xPosition = getCoordinates.x
                    var yPosition = getCoordinates.y
                    var canvasCoordinates ={x: xPosition, y: yPosition}
                    // Adding new coordinate into the array
                    canvasCoordinatesArray.push(canvasCoordinates)
                    // Converting to JSON and saving to the local storage
                    localStorage.setItem("positionPath", JSON.stringify(canvasCoordinatesArray))
            	}
                console.log(JSON.stringify(canvasCoordinatesArray))

//Drawing each dot from the canvasCoordinatesArray
            	for (j=0; j<canvasCoordinatesArray.length-1; j++) 
            	{
                    context.beginPath();
                 context.arc(canvasCoordinatesArray[j].x,canvasCoordinatesArray[j].y,4,0,2*Math.PI);
                     //Connecting dot segments	
                    context.lineTo(canvasCoordinatesArray[(j+1)].x, canvasCoordinatesArray[(j+1)].y)
               	
                                                  	context.fillStyle = "black";
                    context.fill();
                    context.stroke();	
            	}
                                            	
                                            	
                 // Geo measurement function	
                function measure(lat1, lon1, lat2, lon2)
            	{
                     // Radius of earth in Km	
                    var earthRadius= 6378.137; 
                    var changeLat = (lat2 - lat1) * Math.PI / 180;
                    var changeLon = (lon2 - lon1) * Math.PI / 180;
                    var a = Math.sin(changeLat/2) * Math.sin(changeLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                   Math.sin(changeLon/2) * Math.sin(changeLon/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d = earthRadius * c;
                    //In meters
                    return d * 1000; 
          	 	}
                    	
 
// An array which keeps all the subDistance numbers,
//or the distance between each data point
         	var runningDistance = []
                                		 
                                	 for (i = 0; i < self.newRoute.length-1; ++i)
         	{
             	var subDistance = measure(self.newRoute[i].latitude, self.newRoute[i].longitude, self.newRoute[i + 1].latitude, self.newRoute[i + 1].longitude)
                 runningDistance.push(subDistance)
        }
                                            	
                                            	//Initial value 
                                            	totalDistance = 0
          	// Adding all the subDistances in the array to get a total distance
            	for (i = 0; i < runningDistance.length; ++i)
            	{
                    totalDistance = runningDistance[i] + totalDistance
                                                        	
            	}
//Saving total distance to the local storage
                localStorage.setItem("totalDistance", totalDistance)	
                                            	
        	}      	
       	
			
            this.tracking= function ()
        	{
                 //When the tracking is enabled 
            	if (self.trackingEnabled == true)
            	{
    	 // Get the current position  
 
navigator.geolocation.getCurrentPosition(self.drawOnCanvas,self.error,self.option)
                                                        	
            	}
            	else 
//When the end tracking button is clicked
            	{
                //End the function that tracks location
                    clearInterval(trackingID)
            	}
                                            	
        	}
// Calling for location to be tracked every 10 sec

                trackingID=setInterval(this.tracking, 10000)     	}
	}
 
	// The MapPageController calls this to ask if it should return
	// back to the start screen of the app when the user taps the
	// done button.  If you are not letting the user return, you
	// should probably call displayMessage() to inform them why.
	this.mapPageShouldReturnFromDoneButtonTap = function()
	{
        console.log("Record Route - mapPageShouldReturnFromDoneButtonTap");
   	
            // Let the user return.
         	return true;
	}
}
 
 
function ViewRoutePageControllerDelegate()
{
	// Save 'this' so we can refer to public attributes and methods.
	var self = this;
 
	// The MapPageController class controls the 'View Route' page.
	// This class provides a couple of useful methods:
	// 	displayMessage(message):
	//     	Causes a short message string to be displayed on the
	//     	page for a brief period.  Useful for showing quick
	//     	notifications to the user.
	// 	panToLocation(latitude, longitude):
	//     	Pans the map to the given latitude and longitude.
	// 	repaintOverlay():
	//     	Causes the map overlay to be redrawn, triggering a
	//     	call to our mapPageDrawOverlay() method.  You might
	//     	wish to call this when you update information that
	//     	is displayed on the canvas overlay.
	// 	canvasPointFromLocation(latitude, longitude):
	//     	Given a latitude and longitude, returns the
	//     	corresponding point on the canvas overlay.
	//     	The return value is an object with an 'x' and a 'y'
	//     	property.
	var viewRoutePageController = null;
 
	// The originally recorded route being displayed by the viewRoute page.
	var originalRoute;
 
	// NOTE: You should not remove any of the five public methods below.
 
	// This method is called by the MapPageController when the user
	// has switched to the page and it has been intialised.  If the
	// MapPageController is displaying an existing route, then options
	// will contain a 'routeIndex' property which gives the index of
	// the selected route in the Routes array.
    this.mapPageInitialisedWithOptions = function(controller, options)
	{
        console.log("View Route - mapPageInitialisedWithOptions");
        viewRoutePageController = controller;
    	originalRoute = Routes[options.routeIndex]
                    	console.log(originalRoute.locations)
                    	
// Pans the map to the given latitude and longitude when the page is initialised 
                    	viewRoutePageController.panToLocation(originalRoute.locations[0].latitude, originalRoute.locations[0].longitude)
                    	
          // Calling the mapPageDrawOverlay() method 
         //  to draw the current position onto the map
 	viewRoutePageController.repaintOverlay()
                    
	
         this.simplifyRouteCommand = false             	
       	
                    	
	}
 
	// The MapPageController calls this when loading its page.
	// You should return an array of objects specifying buttons you
	// would like to display at the bottom of the map, e.g.,
	//	{
	//    	title:   "Start",
	//    	id:      "startButton",  (optional)
	//	}
	// Note: This doesn't support an "onClick" property like in
	// Assignment 1.
    this.mapPageButtonControls = function()
	{
        console.log("View Route - mapPageButtonControls");
//Creating four buttons 
    	return [{title: "Total Distance"}, {title: "Average Speed"}, {title: "Simplified Route"}, {title: "Original Route"}];
	}
 
	// The MapPageController calls this when user taps on a button
	// specified by mapPageButtonControls().  The buttonIndex will
	// be the index of the button in the aray you returned.
    this.mapPageButtonTapped = function(buttonIndex)
	{
        console.log("View Route - mapPageButtonTapped(" + buttonIndex + ")");
                    	
// When the total distance button is clicked
                    	  if (buttonIndex == 0) 
                    	  {
//Display the distance walked in meters
                                	  viewRoutePageController.displayMessage("You walked " + Number(originalRoute.distance).toFixed(0) + " meters")
                    	  }

// When the average speed button is clicked
                    	  if (buttonIndex == 1) 
                    	  {
//Display the average speed in km/h 
                                	  viewRoutePageController.displayMessage("Your average speed was " + originalRoute.speed.toFixed(2) + " km/h")
                    	  }
// When the simplified route button is clicked

		                  if (buttonIndex == 2) 						
  {
							  
                          this.simplifyRouteCommand = true

//Geo measurement function
	function measure(lat1, lon1, lat2, lon2)
{
				/* Radius of earth in Km*/									var earthRadius= 6378.137; 
				var changeLat = (lat2 - lat1) * Math.PI / 180;
				var changeLon = (lon2 - lon1) * Math.PI / 180;
				var a = Math.sin(changeLat/2) * Math.sin(changeLat/2) +
												Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
												Math.sin(changeLon/2) * Math.sin(changeLon/2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				var d = earthRadius * c;
				return d * 1000;
								}

//Making a copy of position array of originalRoute
//so that it can be used for simplifying the route
							var simpleArray = originalRoute.locations.slice()
							
//Function to simplify the route
							function simplifyArray() /* this functions iterates through all values in the self.newRoute array in order to simplify it. This is done by checking when the distance from point a to point c is within three meters of the distance from point a to point b PLUS point b to point c. If the distance similarity is within three meters than point c is deleted from the array. */
							{

								for (i = 0; i<(simpleArray.length-2); ++i)
								{
									var threePointRoute = measure(simpleArray[i].latitude, simpleArray[i].longitude, simpleArray[i+1].latitude, simpleArray[i+1].longitude) + measure(simpleArray[i+1].latitude, simpleArray[i+1].longitude, simpleArray[i+2].latitude, simpleArray[i+2].longitude)

									var twoPointRoute = measure(simpleArray[i].latitude, simpleArray[i].longitude, simpleArray[i+2].latitude, simpleArray[i+2].longitude)


									if (threePointRoute - twoPointRoute < 3)
									{
										simpleArray.splice(i+1,1)
										simplifyArray()
									}
									else
									{
									}
								}

							}


//Convert to JSON and save to local storage

							simplifyArray()
							localStorage.setItem("simplifiedRoute", JSON.stringify(simpleArray))
							viewRoutePageController.displayMessage("Simplified Route")
 // Calling our mapPageDrawOverlay() method 
 //  to draw the current position onto the map
viewRoutePageController.repaintOverlay();
		 				  }

// When the original route button is clicked
		     if (buttonIndex == 3) 
			 {
				 this.simplifyRouteCommand = false
                                              // Calling our mapPageDrawOverlay() method 
				 viewRoutePageController.repaintOverlay()
				 viewRoutePageController.displayMessage("Original Route")
			 }
				 
	}
 
	// The MapPageController calls this when the canvas needs to be
	// redrawn, such as due to the user panning or zooming the map.
	// It clears the canvas before calling this method.
	// 'context' is an HTML canvas element context.  This is a
	// transparent layer that sits above the map and is redrawn
	// whenever the map is panned or zoomed. It can be used to
    	// draw annotations on the map or display other information.
    this.mapPageDrawOverlay = function(array)
	{
                   //When the simplified route button is clicked
		if (this.simplifyRouteCommand == true)
		{ 
                          // Retrieve simplified route data from local storage
                          //Convert JSON string into an object 
			array = JSON.parse(localStorage.getItem("simplifiedRoute"))
		}
                   //When the simplified route button is not clicked
                  // Return original routes
		else
		{ 
			array = originalRoute.locations
		}
		
        console.log("View Route - mapPageDrawOverlay");

    	//Array storing canvas coordinates of each position
           	var canvasCoordinatesArray = []
          // Converting each position in array to coordinate form
                    	   for (i=0; i<array.length; i++)
            	{
//returns the corresponding point on the canvas overlay                    
var getCoordinates = viewRoutePageController.canvasPointFromLocation(array[i].latitude,array[i].longitude)
//Saving the coordinates in a position object
                    var xPosition = getCoordinates.x
                    var yPosition = getCoordinates.y
                    var canvasCoordinates ={x: xPosition, y: yPosition}
// Adding new coordinate into the array
                    canvasCoordinatesArray.push(canvasCoordinates)
            	}
                    	
                    	//Drawing each dot from the canvasCoordinatesArray
                    	 for (j=0; j<canvasCoordinatesArray.length-1; j++)          
   	{
                    context.beginPath();
                    context.arc(canvasCoordinatesArray[j].x,canvasCoordinatesArray[j].y,4,0,2*Math.PI);
                           //Connecting each dot	
      	          context.lineTo(canvasCoordinatesArray[(j+1)].x, canvasCoordinatesArray[(j+1)].y)
               	
                                                        	context.fillStyle = "black";
                    context.fill();
                    context.stroke();	
            	}
                    	
	}
 
	// The MapPageController calls this to ask if it should return
	// back to the start screen of the app when the user taps the
	// done button.  If you are not letting the user return, you
	// should probably call displayMessage() to inform them why.
    this.mapPageShouldReturnFromDoneButtonTap = function()
	{
        console.log("viewPage mapShouldReturnFromDoneButtonTap");
    	return true;
	}
}
 
 
 
 




