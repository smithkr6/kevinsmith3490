deployed version for this project: https://smithkr6.github.io/kevinsmith3490/

#UI information
Rather than automatically moving the Map interface to the user's location I made it go to belk hall to a marker I prepared placed in the view--I did this so you don't have to create new markers at your location just to test it.

tap/click the marker that is on screen, this triggers a popup displaying on the marker and performs the following:
	-the main feed of where the subreddit where markers are stored, reddit.com/r/unfortunatemap is scraped, and the json data for each post in the main feed is parsed into data that initializes the markers on the map. Markers on the map contain the author of the marker, and the text text they posted about the marker. (the marker includes none of the comments made to the post because that would be too much data to scrape all at once)
	
	-in the popup a button is placed. This button retrieves all the comments made to that marker from the url of that single full reddit post made to reddit.com/r/unfortunatemap/<coordinates>. The title of reddit posts is initialized to a regex enforced title specifying the format of how I'm querying the markers.
	
	#SCOPE OF THE PROJECT BEGINS HERE#
	-The json data retieved when the button in a marker's popup is selected is parsed into an  string that is formatted as appropriately indented html such that when loaded into a browser, the indented tree hierarchy of comments is properly displayed.

	-this html string displayed in the marker label, but for simplicity sake for the scope of this project, I set three popup windows to be displayed once the button in the label is pressed:
		
		-JSON data: a popup displaying a string representation of the json data that is parsed (it is parsed as string data in a functional manner using mostly recursive implementations of javascript's equivalent of Haskell's Cons.)
		
		-Raw HTML data: a popup displaying the raw html data that my parser outputs on each instance of a button press.

		-HTML formatted text: a popup window that processes the raw html data and displays it as intended to show that the parsed html data is valid.

	-Details regarding the methodology for parsing the json into html are included in the project report
	
#Additional UI information
if want to you can use the mock up interface for creating new markers to the map--when a marker has it's location confirmed, you can click the underlined "comment" link which will direct you to a template for a new reddit post (with an pre initialized title in the text field representing the coordinates at which the marker's position was confirmed). 
After posting the reddit post you can navigate to the map again and view the new marker initialized on the page.

Previous version of this project with the geolocator still implemented: http://unfortunatemap.icu
