// Initialize Firebase
var config = {
	apiKey: "AIzaSyD01RIobihHwub3l42BEWNRVpbShxPay14",
	authDomain: "trainscheduler-fce25.firebaseapp.com",
	databaseURL: "https://trainscheduler-fce25.firebaseio.com",
	projectId: "trainscheduler-fce25",
	storageBucket: "trainscheduler-fce25.appspot.com",
	messagingSenderId: "10729276692"
};
firebase.initializeApp(config);
var snap;
var database = firebase.database();

var newTrainName,
	newDestination,
	newFirstArrival,
	newFrequency,
	goodArrival,
	goodFrequency;

var now = moment();

//function to retreive form info from HTML
function retrieveFormInfo() {
	newTrainName = $('#trainName').val().trim();
	newDestination = $('#destination').val().trim();
	newFirstArrival = $('#nextArrival').val().trim();
	newFrequency = $('#frequency').val().trim();

	//check that Time information is in write format,
	//if not, don't delete info and throw error message on html
	if (newFrequency > 0) {
		goodFrequency = true;
	} else {
		goodFrequency = false;
	}
	// if (newFirstArrival right, true, else false)********************
	// look into isValid function in MomentJS

	//clear HTML forms
	$('#trainName').val('');
	$('#destination').val('');
	$('#nextArrival').val('');
	$('#frequency').val('');
}

//function to append row to Train Table
function appendRow (trainName, destination, frequency, nextArrival, minutesAway) {
	var row = $('<tr>');
	var nameData = $('<td>').append(trainName);
	var destinationData = $('<td>').append(destination);
	var frequencyData = $('<td>').append(frequency);
	var arrivalData = $('<td>').append(nextArrival);
	var awayData = $('<td>').append(minutesAway);

	var arr = [nameData, destinationData, frequencyData, arrivalData, awayData];
	for(var i=0; i<arr.length;i++) {
		row.append(arr[i]);
	}

	$('#trainTableBody').append(row);
	
}
var count=0;
//calculate next Arrival based on frequency and first arrival
function nextArrival (freq, firstArr) {
	//create Today's date with first Arrival time to ...
	var currentT = moment();
	console.log(currentT);
	console.log(freq);
	freq=parseInt(freq);
	console.log(freq);
	var arrivalTime = moment(freq, 'HH:MM');
	// var arrivalTime = moment(new Date(moment().year(year), moment().date(day), moment().month(month), parseInt(firstArr.substring(0,2)), parseInt(firstArr.substring(3,5))));
	console.log(arrivalTime);
	//if difference is positive, then current time is past first arrival
	var diffTime = moment().diff(arrivalTime, 'm');
	console.log(diffTime);
/*	if(diffTime>0){
		return 'calculating';
	} else if (diffTime < 0) {
		console.log(moment(firstArrival).format('HH:MM'));
		return moment(firstArrival).format('HH:MM');
	} else if(diffTime == 0) {
		return 'Now';//return in format just to throw in appendRow function
	}*/
		
}

//calculate minutes away
function minutesAway (nextArrive) {
	//subtract current time from nextArrival time in momentJS
	//return in proper format
}

//When submit clicked, submit form info to Database
$('#submitBtn').on('click', function(){
	//retrieve form info and then
	retrieveFormInfo();
	console.log(newTrainName);
	console.log(newDestination);
	console.log(newFirstArrival);
	console.log(newFrequency);

	//send info to FireBase now IF inputs are good
	database.ref().push({
		trainName : newTrainName,
		destination : newDestination,
		firstArrival : newFirstArrival,
		frequency : newFrequency
	});
});

//build table initially/whenever data added
database.ref().on('value', function(snapshot) {
	//clear and remake table, THE WORST WAY TO DO THIS BE SURE TO FIX THIS
	$('#trainTableBody').html('');
	
	snap = snapshot.val();
	Object.keys(snap).forEach(function(index){
		// var nextArrival = nextArrival(snap[index].frequency, snap[index].firstArrival);
		var minutesAway = 0;		
		appendRow(snap[index].trainName, snap[index].destination, snap[index].frequency, nextArrival(snap[index].frequency, snap[index].firstArrival), 'NA');
	})	
});

$(document).ready(function(){
	console.log('doc ready');
	$('#currentTime').html('Now: ' + moment().format("h:mm a"));
});