function storeItem(todoItem) {
	 alert("Your browser does not support localStorage, your task " + todoItem.task + " will not be saved");
	 console.log("Error: you don't have localStorage!");
	 return;	
}

function getLocalStorage(todos) {
	if (!todos) {
		alert("No local storage to save your todo items!");	
	}
	console.log("Error: you don't have localStorage!");
	return todos;
}