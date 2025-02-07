// 
document.getElementById("nameForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const name = document.getElementById("name").value; 
    console.log("Entered Name:", name); // Log to console

});
