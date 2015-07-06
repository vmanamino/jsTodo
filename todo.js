function Todo(id, task, who, dueDate, locale) {
    this.id = id;
    this.task = task;
    this.who = who;
    this.dueDate = dueDate;
    this.done = false;
    this.locale = locale;
}

var todos = new Array();
var geoLocation = ""; 
var map = null;

function init() {    
    findLocation();
    var submitButton = document.getElementById("submit");    
    submitButton.onclick = getFormData;
    var searchButton = document.getElementById("searchButton");
    searchButton.onclick = searchText;
    getTodoItems();
   
    
}

function getTodoItems() {
	todos = getLocalStorage(todos);
	addTodosToPage();
   
}

function addTodosToPage() {
    var ul = document.getElementById("todoList");
    var listFragment = document.createDocumentFragment();
    for (var i = 0; i < todos.length; i++) {
        var todoItem = todos[i];
        var li = createNewTodo(todoItem);
        listFragment.appendChild(li);
    }
    ul.appendChild(listFragment);
}
function addTodoToPage(todoItem) {
    var ul = document.getElementById("todoList");
    var li = createNewTodo(todoItem);
    ul.appendChild(li);
    document.forms[0].reset();
}

function createNewTodo(todoItem) {
    
    var li = document.createElement("li");
    li.setAttribute("id", todoItem.id);
    
    
    var spanTodo = document.createElement("span");
    var daysRemaining = getDaysLeft(todoItem.dueDate);
    spanTodo.innerHTML =
        todoItem.locale +" "+todoItem.who + " needs to " + todoItem.task + " by " + todoItem.dueDate + " " + daysRemaining;

    var spanDone = document.createElement("span");
    if (!todoItem.done) {
        spanDone.setAttribute("class", "notDone");
        spanDone.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    else {
        spanDone.setAttribute("class", "done");
        spanDone.innerHTML = "&nbsp;&#10004;&nbsp;";
    }
    
    spanDone.onclick = updateDone;
    
    var spanDelete = document.createElement("span");
    spanDelete.setAttribute("class", "delete");
    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";

    spanDelete.onclick = deleteItem;

    li.appendChild(spanDone);
    li.appendChild(spanTodo);
    li.appendChild(spanDelete);
    
    return li;
}

function getDaysLeft(dueDate) {
	if (dueDate == null || dueDate == "") {
        alert("Please enter a date");
        return;
    } 
    var dateDue;
    var dateMillis = Date.parse(dueDate);
    var dateNow = new Date();     
     
     try {
     
     	if (isNaN(dateMillis)) {
     		throw new Error("Date format error.  Please delete task and re-enter providing the month, day and year like so: January 1, 2013")    	
     	}
    
    	else {
    		dateDue = new Date(dateMillis);   
    	}
    	var diff = dateDue.getTime() - dateNow.getTime();
    	var days = Math.floor(diff / 1000 / 60 / 60 / 24);
    	
    	if (days >= 0) {
    		return "(" + days + " day(s))";
    	}
    	else {
    		days =- days
    		return "(OVERDUE by " + days + " days)";	    	
    	}
    
    }
    
    catch (ex) {
    	alert(ex.message);
    	return "***date not properly specified";
    	}
}
     
function getFormData() {    
    var task = document.getElementById("task").value;
    if (checkInputText(task, "Please enter a task")) return;

    var who = document.getElementById("who").value;
    if (checkInputText(who, "Please enter a person to do the task")) return;

    var date = document.getElementById("dueDate").value;
    if (checkInputText(date, "Please enter a due date")) return;
    
    var id = (new Date()).getTime();
    var locus = geoLocation;
    var todoItem = new Todo(id, task, who, date, locus);    
    todos.push(todoItem);
    addTodoToPage(todoItem);
    saveTodoItem(todoItem);
}

function checkInputText(value, msg) {
    if (value == null || value == "") {
        alert(msg);
        return true;
    }
    return false;
}

function saveTodoItem(todoItem) {
	storeItem(todoItem);
} 

function updateDone(e) {
	var span = e.target;
    	var id = span.parentElement.id;
    	var key = "todo"+id;
	for (var i = 0; i < todos.length; i++) {
    		if (todos[i].id == id){
    			
    			if (!todos[i].done) {
    				todos[i].done = true;
    				var itemReset = JSON.stringify(todos[i]);
    				localStorage.setItem(key, itemReset);
    				span.setAttribute("class", "done");
        			span.innerHTML = "&nbsp;&#10004;&nbsp;";
    				
    			}
    			
    			else if (todos[i].done == true) {
    				todos[i].done = false;
    				var itemReset = JSON.stringify(todos[i]);
    				localStorage.setItem(key, itemReset);
    				span.setAttribute("class", "notDone");
        			span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    				
    			}
			
			break;
    		}
	}
}
	
	

function deleteItem(e) {
    var span = e.target;
    var id = span.parentElement.id;
    console.log("delete an item: " + id);
    
    var key = "todo"+id;
    localStorage.removeItem(key);
    
    for (var i = 0; i < todos.length; i++) {
    	if (todos[i].id == id) {
    		todos.splice(i, 1);
    		break;
    	}
    }
    
    var li = e.target.parentElement;
    var ul = document.getElementById("todoList");
    ul.removeChild(li);
}

//function to get search term and match it against todo items
function searchText() {
	var searchTerm = document.getElementById("searchTerm").value;
	if (searchTerm == null || searchTerm == "") {
        	alert("Please enter a string to search for");
        	return;
    	}
    	
    	//strip preceeding and trailing white space
    	searchTerm = searchTerm.trim();
    	
    	//create regex with search term as the pattern to match on
    	var re = new RegExp(searchTerm, "ig");	
	
	
	//array to hold matches
	var results = new Array();
	
	//loop through todos array to match on who OR task properties of todo objects
	for (var i = 0; i < todos.length; i++) {
	
		if (todos[i].who.match(re) || todos[i].task.match(re)) {
		
		//in case of match, push todos object to results array which will be passed to showResults() that will display the objects
		results.push(todos[i]);
		
		}
	
	}
	
	//if results array lacks content, create proper message by removing any previous results
	if (results.length == 0) {
    		
    		var ul = document.getElementById("matchResultsList");
		clearResultsList(ul);
		
		var message = document.createElement("h4");
		message.innerHTML = "Your search has no matches.";
		
		ul.appendChild(message);
		
		
   	}
   	//otherwise, show results on page
    	else {
    		
    		showResults(results);
    	}
	
	
}

function clearResultsList(ul) {
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}
}

function showResults(results) {
	var ul = document.getElementById("matchResultsList");
	clearResultsList(ul);
	var frag = document.createDocumentFragment();
	for (var i = 0; i < results.length; i++) {
		var li = document.createElement("li");
		li.innerHTML = results[i].who + " needs to " + results[i].task + " by " + results[i].dueDate;
		frag.appendChild(li);		
	}
	ul.appendChild(frag);
}

function addGeolocation(latitude, longitude) {	
	var coordinates = "("+latitude+", "+longitude+")";
	geoLocation = coordinates;
	if (!map) {
		showMap(latitude, longitude);	
	}
	addMarker(latitude, longitude);
	
}

function noGeolocation(message) {
	geoLocation = message;
}

function showMap(lat, long) {
	var googleLatLong = new google.maps.LatLng(lat, long);
	var mapOptions = {
		zoom: 12,
		center: googleLatLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
	map.panTo(googleLatLong);
}

function addMarker(lat, long) {
	var googleLatLong = new google.maps.LatLng(lat, long);
	var markerOptions = {
		position: googleLatLong,
		map: map,
		title: "Where I'm thinking today"	
	}
	var marker = new google.maps.Marker(markerOptions);
}


    