// Initialize Firebase
var config = {
    apiKey: "AIzaSyCUa3OmzBQAV9MHxQg6Pgl2s5533V5qjEI",
    authDomain: "coder-bay-fee9d.firebaseapp.com",
    databaseURL: "https://coder-bay-fee9d.firebaseio.com",
    storageBucket: "coder-bay-fee9d.appspot.com"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

$(".form-button").on("click", function (event) {
    event.preventDefault();
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var frequency = $("#frequency").val().trim();
    var trainTime = $("#firstTrainTime").val().trim();
    
    //   converting to object, convert to unix
    var time = moment(trainTime, "HH:mm").format("X");
    
    var trainObject = {
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        trainStartTime: time
    }
    
    // pushes object to firebase
    database.ref().push(trainObject);
    
    // This clears form
    $("#trainName").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#firstTrainTime").val("");
    
});

database.ref().on("child_added", function(childSnapshot){
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var trainTime = childSnapshot.val().trainStartTime;
    // converting unix time into a moment object, because we have to use a moment method which we can't do unless it's an object
    var time = moment.unix(trainTime);

    // how many minutes current time and start time?
    // i.e. Current time 15:03, start time is noon, minute diff 15:03 - noon = 183 minutes
    var currentTime = moment();
    var minuteDif = currentTime.diff(time, "minutes"); 
    // get remainder from dividing minutes by frequency
    // i.e. 183 / frequency of ten = 18 with a remainder of 3
    var remainder = minuteDif % frequency;
    // frequency minus remainder to get minutes until the next train, for minutes
    // i.e. the minutes away in our example 10 - 3, 10 is frequency and 3 is the remainder, the remainder is the time since the last train past, the train is 7
    // minutes away
    var minutesAway = frequency - remainder;
    // add minutes to current time to get clock time for the next train arrival, 2 lines to do this
    // i.e. current time of 15:03 plus seven minutes is going to equal 15:10, this will give us clock time as an object
    var clockTimeObject = currentTime.add(minutesAway, "minutes");
    var clockTime = clockTimeObject.format("HH:mm");
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(clockTime),
        $("<td>").text(minutesAway),
        
    );

    $("#train-body").append(newRow);

});

// this will delete database
// database.ref().remove();


// add features

// make sure time returns a valid time
// make sure user doesn't leave any empty input fields
// make sure frequency they enter is a number
// imagine if start time is later than current time, then you want the next train time to be the start time
