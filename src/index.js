//THE FUNCTIONAL PARSER OF JSON TO HTML BEGINS ON LINE 212

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import mapboxgl from 'mapbox-gl';
import $ from 'jquery'; 

//random coordinates to start zoom animation from
var lon = -78.8359;
var lat = 35.7814;
mapboxgl.accessToken = 'pk.eyJ1Ijoic21pdGhrcjYiLCJhIjoiY2s1eng5cXhkMDBqYzNrbGlxY2llamwzYiJ9.EiSYrIube_whxrve-t_47Q';

class Application extends React.Component {
  
   constructor(props) {
      super(props);
      this.state = {
         lng: lon,
         lat: lat,
         zoom: 10,
         thread: "not loaded"

      };
   }

   /*----------------------------------------------------------------------
   ------------------------------------------------------------------------
   --------------------MAP COMPONENT MOUNTS--------------------------------
   ------------------------------------------------------------------------
   ------------------------------------------------------------------------
   ------------------------------------------------------------------------
   */

   componentDidMount() { 
 
   // create geolocateControl object and set settings-- 
   // creating this GeoControl must happen before creating the map so it can be configured before it's implemented
   // geolocate takes a couple seconds also, so giving it a headstart makes the ui less confusing as its loading
   // var geolocate = new mapboxgl.GeolocateControl({positionOptions: {enableHighAccuracy: true}, trackUserLocation: true}); //GeolocateControl settings 
   
   //geolocate.on('geolocate', function(e) { //on geolocate global coord position updates
      //boone coordinates to show test markers that use html popups as examples.
      //lon = e.coords.longitude;
      //lat = e.coords.latitude;
   //});

   //load mapbox map with streets and styles in the mapContainer 
   const map = new mapboxgl.Map({ 
      container: this.mapContainer,
      style: 'mapbox://styles/smithkr6/ck9jwp4v217uu1ippf9kjbzct',
      //center: [this.state.lng, this.state.lat],
      center: [-81.6806,36.2142],
      zoom: 18.15,
     // zoom: this.state.zoom,
   });

   //map.addControl(geolocate);  //must grant geolocate control to the mapbox map for positioning user 
   //map.on('load', function() { geolocate.trigger(); });  //trigger geolocate automatically
   //alert("This Web Application is for experimental purposes only.\nTo delete markers and/or comments, delete them from Reddit.")

    //when moving the map with dragging, update coordinates of center of the map
   map.on('move', () => { 
      this.setState({
         lng: map.getCenter().lng.toFixed(4),
         lat: map.getCenter().lat.toFixed(4),
         zoom: map.getZoom().toFixed(2),
      });
   });

/*-----------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------CS3490 PROGRAMMING LANGUAGES  FINAL PROJECT: --------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------MAP INITIALIZER
-------------------------------------------- get json data from the main feed of the subreddit, r/unfortunateMap.
-------------------------------------------- this json data is extensive and to initialize the map very little data is required,
-------------------------------------------- so the following section parses the main feed data 
-------------------------------------------- 
-------------------------------------------- this task was attempted in a functional style: 
--------------------------------------------    minimizing use of destructive variable,
--------------------------------------------    without utilizing global variables for the scope of this parser, 
--------------------------------------------    without reassigning the values of varibles,
--------------------------------------------    without modifying variables or modifying data structures, 
--------------------------------------------       instead passing/returning copies through functions
--------------------------------------------
--------------------------------------------
--------------------------------------------
--------------------------------------------
--------------------------------------------
--------------------------------------------
*/ 

   //------------------------------
   //Helper functions for parsing Post previews from main feed into map markers 
   //------------------------------
   function cleanUp(txt) {
      if (keepLine(getLine(txt)))   return getLine(txt) + cleanUp(removeTopLine(txt));
      else                          return cleanUp(removeTopLine(txt));
   }
   function keepLine(line) {
      if  (line.includes('"author"'))   return true;
      if  (line.includes('"title"'))    return true;
      if  (line.includes('"selftext"')) return true;
   }
   function getLine(txt) {
      if (txt[0]!== '\n') return txt[0] + getLine(txt.substring(1));
      else return '\n';
   }
   function removeTopLine(txt) {
      //return txt.substring(txt.indexOf("\n") + 1); // this works but crashes bc too big 
      if (txt[0] !== '\n') return removeTopLine(txt.substring(1));
      else return txt.substring(1); //for this else, txt[0] == '\n' so return whats after the \n with txt.substring(1) 
   }
   
   //calculate distance b/w user coordinates and coordinates parsed out of this functions argument, str.
   function getDistance(str) { 
      //split the str into 2 number array, coord.
      return Math.sqrt(Math.pow((map.getCenter().lng - str.split(',')[0]),2) + Math.pow((map.getCenter().lat - str.split(',')[1]),2));
   }

    /*
    * GRAB MAIN FEED post previews from reddit.com/r/unfortunateMap
    *  retrieve json data for the entire feed of r/unfortunateMap
    *  $.getJSON is async, so going to parse what it receives in its promise
    */
   function grabFeedJSON(link)  {
      return $.getJSON(link, function (dat) {
      });
   }

   /*---------------------------------------------------------------------------------------
   *----------------------------------------------------------------------------------------
   *----------------------MARKER PREVIEWS---------------------------------------------------
   *----------------------------------------------------------------------------------------
   *----------------------------------------------------------------------------------------
   *-----this "then" will execute once grabFeedJSON has finished retrieving the json file
   */
   //var feed_map = new Map();
   var strtemp = '';
   var subreddit_link = "https://www.reddit.com/r/unfortunateMap/.json";
   grabFeedJSON(subreddit_link).then(function(json_data) {                      //call function to grab entire json, then...this following function
      $.each(json_data.data.children, function (key, marker) {    //iterate through each of "children" and create a new json element for each marker
            strtemp = strtemp + ',{"rank":"'    + key + '"'                            //ordered by appearence in the main feed (don't need rank)
                              + ',"title":'     + JSON.stringify(marker.data.title)    //coordinates of marker
                              + ',"url":'       + JSON.stringify(marker.data.url)      //url of marker
                              + ',"author":'    + JSON.stringify(marker.data.author)   //author of marker
                              + ',"selftext":'  + JSON.stringify(marker.data.selftext)
                              + ',"dist_from":' + getDistance(marker.data.title)   //add field for distance from user
                              + '}';
      });

      strtemp =  '({"marker_previews":[' + strtemp.substring(1) + ']})'; //substring just for removing preceding comma
      console.log(strtemp);
      var new_json = eval("(" + strtemp + ")");      //convert the string to json w/ "eval", then format it nicely to a string.
      

     
      //populate the map with markers
      $.each(new_json.marker_previews, function (i, marker) {
         var el = document.createElement('div');
         el.className = 'marker';
         var parsed = marker.title.split(',');   //convert string to coordinates
         var mark = new mapboxgl.Marker(el);
         var tempp = document.createElement("button");
         tempp.className   = marker.title.toString();                                             //className for the button; will probably end up being unnecessary cause only 1 button
         tempp.id          = marker.title.toString();
         tempp.innerHTML   = "<h5>Show Comments</h5>";                                         // text displayed on the button. text will change to "Confirm Position" after clicked once
         tempp.target      = marker.url + '.json';
         tempp.onclick = function () {
            if (tempp.innerHTML==="<h5>Show Comments</h5>") {
               tempp.innerHTML="<h5>Hide Comments</h5>";
            }
            else if (tempp.innerHTML==="<h5>Hide Comments</h5>") tempp.innerHTML="<h5>Show Comments</h5>";
            updateSelectedMarker(tempp.target);
            console.log("CLICKED");
         }
         var tempp2 = document.createElement("div");
         tempp2.className  = 'section' + marker.title.toString();
         tempp2.id         = 'section' + marker.title.toString();
         tempp2.innerHTML = "<body><h3><b><i>" + marker.title  + '</i><br><sub>' + marker.author + '</sub></b></h3><p>' + marker.selftext + '</p><p><a href="' + marker.url + '" target=_blank">comment</a></p></body>';
         tempp2.appendChild(tempp);
         
         mark.setLngLat(parsed)
            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups to markers
            .setDOMContent(tempp2))
            .addTo(map);
            });

         //for (const k of feed_map.keys()) {
         //   feed_map.get(k).addTo(map);
         // }
   
      });

         

   
         
   /*---------------------------------------------------------------------------------------
   *----------------------------------------------------------------------------------------
   *---------------------SELECTED MARKER COMMENTS--------------------------------------------------------
   *--------------------------CONVERT JSON TO HTML -----------------------------------------
   *----------------------------------------------------------------------------------------
   *------------when marker clicked get full marker data------------------------------------
   *----------------------------------------------------------------------------------------
   *----------------------------------------------------------------------------------------
   */   
   // var markerpost = {"title": "", "author": "", "body": "", "replies": []};  

   //function that grabs json of a marker post url
   function grabMarkerJSON(link)  {
      return $.getJSON(link, function (dat) {
      });
   }

   //because the request is async, keeping the functional logic within the .then of the grabMarkerJSON function--
   //the json returned by grabMarkerJson is passed as the argument the .then inline function as json_data.
   function updateSelectedMarker(url){
      console.log("updateSelectedMarker reached");
      grabMarkerJSON(url).then(function(json_data) {               //this is "main" function for the functional json to HTML converter

         //recursive JSON sorting algorithm alphabetically by property (key)
         //This function is imperative, it just prepares the data for the parser
         function sortObject(obj) {
            if(typeof obj !== 'object')   return obj;
               var temp = {};
               var keys = [];
               for(var key in obj)
                  keys.push(key);
               keys.sort();
               for(var index in keys)
                 temp[keys[index]] = sortObject(obj[keys[index]]);       
               return temp;
         }
         
         //-------------------
         // HELPER FUNCTIONS
         //--------------------
         
        function authorLine(str) {
            //first split is incase an author has a quot in their name (.split splits the string by quot characters into an array)
            //slice(3) returns a new array of its elements from index 3 to the last index 
            //the final slice slices the last quotation and a comma off end of string
            if (removeSpaces(str).substring(0, 8) ===  '"author"')  return str.split('\\"').join('"').split('"').slice(3).join('"').slice(0,-1); 
            else return "";
         }
         
         function bodyLine(str) {
            //if a copy of str without spaces matches the pattern of starting with '"body"' then return the data content that follows
            if (removeSpaces(str).substring(0, 6) ===  '"body"') return str.split('\\"').join('"').split('"').slice(3).join('"').slice(0,-1);   
            else return "";
         }
        
         function removeComma(str) {
            //if the last char is comma, return a copy of str that has the last char removed
            if (str[str.length-1] === ',') return str.substring(0,str.length-1); //if last char is comma, return string w/o last char
            else return str;
         } 
   
         function removeSpaces(str) {         
            //return a copy of str with its spaces removed 
            if (str === undefined) return "";
            else {
               return str.split(" ").join("");
            }
         }

         //checks if str contains desireable data worth keeping,
         function isKeeper(str) {
            if (
                  authorLine(str) !== ""  || //authorLine returns "" if it doesn't start with "author"
                  bodyLine(str)  !==  ""     //bodyLine returns "" if it doesn't start with "body"
               )
               return true;
            return false;
         }
        
         //takes an array of lines and returns an array of lines worth keeping
         //argument is array of lines--each element is a str representation of json text
         function retValidLines(iArr) {
            if (iArr[0] === undefined) return [""];
            else if (isKeeper(iArr[0])) { 
               return retValidLines(iArr).unshift(removeComma(iArr.shift());       //this prepends the commaless str to beginning of array              
            }
            else {//dontkeep
               iArr.shift();                 //used shift because shallowcopy causes stackoverflow for this function
               return retValidLines(iArr);   //return a retry that is passed a copy of the array w/o the invalid element
            }
         }

         // retrieves n lines of a multiline string into an n element array of strings (n argument added do data can be processed in blocks if needed, (blocking not implemented yet)
         function jsonSectionSelectToArr(json_formatted_string, n) {
            return json_formatted_string.split('\n', n);          //split elements at newline into an array 
         }

         //return number of spaces that precede the first non-space character 
         function countSpaces(str) {
            if (str[0] == ' ') return 1 + countSpaces(str.substring(1));
            else return 0;
         }

         //swap instances of \n with <br> for HTML formatting
         function replaceWithHTMLbreaks(str) {
            return str.split("\n").join("<br>")
         }
       
         //returns the html code for line breaks
         function hrTag(thiccness) {
            return '<hr style = display: block; margin-top: 0.5em; margin-bottom: 0.5em; margin-left: auto; margin-right: auto; border-style: inset; border-width:' + thiccness.toString() + 'px;">';
         }       
        
         //replace preceding spaces that remain from the JSON.stringify with the html tag for a block indentation of a size based on the number of spaces that were there
         function formatHTMLComment(str) {
            if (authorLine(str) !== "") return hrTag(1) + '<div style="color: grey;margin-left: ' + ((countSpaces(str)-3)/5).toString() + 'em;">' + authorLine(str) + "</div>";
            if (bodyLine(str) !== "")   return '<div style="color: darkblue;margin-left: ' + ((countSpaces(str)-3)/5).toString() + 'em;">-> ' + bodyLine(str) + "</div>";
         }
        
         //formats the line of an arr as html
         function commentsArrToHTMLArr(arr) {
            if (arr[0] !== undefined) return [formatHTMLComment(arr[0])].concat(commentsArrToHTMLArr(arr.slice(1)));
         }
        
         //simply returns string representation of JSON data
         function jsonToString(json) {
            return JSON.stringify(json, undefined, 1);
         }
        
         //builds the full HTML representation of the data on the marker, 
         //combines the original marker annotation with the parsed comment thread.
         function fullHTML(arr) {
            return(     //explicitly placing the main post's title, author, and body(selftext) in HTML with the converted array html lines that was passed as an argument
               "<body><h3><b><i>" + json_data[0].data.children[0].data.title  + "</i><br><sub>" + json_data[0].data.children[0].data.author + "</sub></b></h3><p>" + json_data[0].data.children[0].data.selftext + "</p>" + hrTag(3) +"<p>"  + 
               arr.slice(1).join("") +
               "</p><body>"
            );
         }
         
         //FINAL HTML FOR THE COMMENT THREAD IS COMPOSITION OF THESE FUNCTIONS
         var parsedJSONtoHTML = fullHTML(commentsArrToHTMLArr(retValidLines(jsonSectionSelectToArr(jsonToString(sortObject(json_data)))))));
         
         //DOM elements where this html will be inserted are named in the DOM as "section" + coordinates of the marker
         var retElement = document.getElementById('section' + json_data[0].data.children[0].data.title.toString());
         
         //update the html for the comments section with the follwing compositinon of functions
         retElement.innerHTML = fullHTML(commentsArrToHTMLArr(retValidLines(jsonSectionSelectToArr(jsonToString(sortObject(json_data))))));
         
         //popUpCal creates popups that display the before and after data that is parsed for this project
         popUpCal(json_data, fullHTML(commentsArrToHTMLArr(retValidLines(jsonSectionSelectToArr(jsonToString(sortObject(json_data)))))));
         
         //log the original json data and parsed html to the console
         console.log("json data that is parsed\n" + JSON.stringify(json_data,undefined, 4));
         console.log("fullHTML\n" + fullHTML(commentsArrToHTMLArr(retValidLines(jsonSectionSelectToArr(jsonToString(sortObject(json_data)))))));

      });
   }
   //creates 3 popups displaying json and raw html and formatted html
   function popUpCal(json, html){
      console.log("POPUP made");
      alert("there will be 3 popups triggerd by that 'show comments' button that appears on each marker:\n--the json data that will be parsed into html (displayed as a string)\n--the parsed html\n--proof that the html displays");
      var win1 = window.open("", "json", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200");
      win1.document.body.innerText = "----------the json data received from this marker post made to the subreddit r/unfortunateMap:\n" + JSON.stringify(json);

      var win2 = window.open("", "rawhtml", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200");
      win2.document.body.innerText += "----------The html that was parsed from json is as follows:\n" + html;
      
      var win3 = window.open("", "html", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200");
      win3.document.body.innerHTML = "<h3><b>Proof that the html properly displays:</b><br></h3>" + html;
      
   }

     
     
     
     
   /*---------------------------------------------------------------------------------------
   *----------------------------------------------------------------------------------------
   *----------------------USER INTERFACE----------------------------------------------------
   *----------------------------------------------------------------------------------------
   *----------------------------------------------------------------------------------------
   *------------when marker clicked get full marker data------------------------------------
   *----------------------------------------------------------------------------------------
   *----------------------------------------------------------------------------------------
   */   

   var marker              = null;                                         //create variable for the mapbox marker
   var newMarkerCoord      = null;                                         //create variable for the users chosen coordinates for the marker
   var dumpsterName;                                                       //create variable for the field concerning the user's name of the marker
   var dumpsterComment;                                                    //create variable for the field concerning the user's comments about the marker
   var newMarkerBtn        = document.createElement("button");                     //button for creating a marker, then confirming its position
   newMarkerBtn.className  = "button";                                             //className for the button; will probably end up being unnecessary cause only 1 button
   newMarkerBtn.innerHTML  = "New Marker";                                         // text displayed on the button. text will change to "Confirm Position" after clicked once
   newMarkerBtn.id         = "newMarkerBtn";
   var sidebarStyle        = document.getElementsByClassName("sidebarStyle")[0];   // get sidebarstyle element
   sidebarStyle.appendChild(newMarkerBtn);    
   var popup = new mapboxgl.Popup({offset: 50})
      /*-------------------------
       Event handler for button 
       1st click creates a draggable marker...the user drags it where they desire
       2nd click confirms the markers location and replaces it with an undraggable marker with text fields for: the name they choose for the marker, comments about the marker,...maybe more
       3rd click removes the marker after the position has been confirmed
       ----------------------------------------------------------------------------------------------------------------*/
   newMarkerBtn.addEventListener ("click", function() {       
      sidebarStyle.appendChild(newMarkerBtn); 

            

      //[2nd click] this "if" statement handles the second click of the button
      if(marker!=null && marker.isDraggable()) {      //if marker!=null and the marker is draggable, then the user confirmed the location of the draggable marker
         newMarkerCoord = marker.getLngLat();        //save coordinates of confirmed location
         marker.setDraggable(false);
         newMarkerBtn.innerHTML = "reset";
         marker.setPopup(popup.setHTML('<h5> Spot Location </h5><p><'+ marker.getLngLat().lng  + ', ' + marker.getLngLat().lat + '></p><p>Say something about the dumpster</p>'))
            .togglePopup(); 

         marker.setPopup(popup.setHTML('Describe this location in a <a href="https://old.reddit.com/r/unfortunateMap/submit?title=' + marker.getLngLat().lng  + ', ' + marker.getLngLat().lat + '&selftext=true&text = https://unfortunatemap.icu" target="_blank" >comment</a></p>'))
            .togglePopup(); 
            
      }
        //[3rd click] this "if" statement handles the 3rd click of the button for deleting the marker with the confirmed position 
      else if(marker !=null && !marker.isDraggable()){        // once button is clicked, this executes iff the marker has been created and the position has been confirmed
            marker.remove();                                    //removed markers are not null
            marker.setDraggable(true);
            marker = null;                                      //go back to conditions of marker suited for 1st click
            newMarkerBtn.innerHTML = "New Marker";
            window.location.reload();
            return false
            //sidebarStyle.appendChild(newMarkerBtn);
      }
        // [1st click]  marker is null
      else
      {
         newMarkerBtn.innerHTML = "Confirm Position";
         marker = new mapboxgl.Marker({draggable: true})                                     //set position beforehand so the popup window can be loaded with coordinates when marker spawns
            .setLngLat([map.getCenter().lng, map.getCenter().lat]);

         marker.setPopup(new mapboxgl.Popup({offset: 50})                                    //make new popup attached to marker and set its offset 
            .setHTML('<h3> Drag this Marker </h3><h9><p>'+ marker.getLngLat().lng  + ',\n ' + marker.getLngLat().lat + '</p></h9>' ))    //load the html to go in popup including markers current coordinates
         marker.addTo(map).togglePopup();                                                    //add marker to the map and trigger the popup 
            
            //all while dragging the marker, the following occurs
         marker.on('drag', () => {                                                           //while marker is being dragged, perform function instance that's denoted by and following: ()

         newMarkerBtn.innerHTML = "<h3>Confirm Position</h3>\n<p>"+ marker.getLngLat().lng  + ',\n' + marker.getLngLat().lat + '</p>';             //move button
                
         marker.setPopup(popup                               //continuously show a new popup...
            .setDOMContent(newMarkerBtn))
            .togglePopup();                                                             //...and continuously show the popup 
         });
      }
   });      



}

render() {
    return (
      <div>
      <div className='sidebarStyle'>
        <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>  
      </div>
      <div ref={el => this.mapContainer = el} className='mapContainer' />
      </div>
      )
}

}

ReactDOM.render(<Application />, document.getElementById('app'));


reportWebVitals();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
