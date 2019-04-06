# B.R.T.D. Changelog
  
## v1.0.0 Alpha  
Date: April 5, 2019  

---  
### Additions:
 - Added keyboard input
 - Added Vash helpers
 - Added Vash Helpers
 - Added Login Page
 - Added Register Page
 - Added Empty Dashboard page
 - Added Permit middleware to allow role based authentication
 - Added Authentication middleware to process the session on each request
 - Added ViewModel classes with corresponding interfaces
 - Added ViewModel test
 - Added ValidationSummary Html helper
 - Added Server side validation feedback
 - Added ability to send the server move updates
 - Added tests for the player simulation object
 - Added ability to send move updates to the client
 - New players are now added to everyone elses screen when they join
 - The game is now simulaed on the server side using box2d 30 times a second
 - Added a player to the screen with a flashing animation
 - Added player move queue
 - Added a basic main menu to ask for your nickname
 - Added CI/CD Pipeline
 - Added Heroku deployments
 - Made the canvas 1280 x 720
 - 
### Updates:
 - Made the PlayerMoveDirection enum a bit easier to read
 - GitLab CI/CD will now force the git push
 - Converted Vash helpers to typescript

### Bugfixes:
 - Fixed route to 404 page due to case sensitivity
 - Fixed inverted y-coordinates in tests

### Known Bugs
 - Disconnected players are not removed from the screen
 - Sometimes the game rejects all player input and prevents all movement


