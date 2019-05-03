# B.R.T.D. Changelog

## v3.0.0 release
Date: April 30, 2019

## Additions
 - Items now spawn on the map
 - The player is now spawned around the edge of the map
 - The world generation now uses new textures
 - The player is now animated
 - The health now has a cool animation when losing some
 - The player now gets a red flash when they take damage
 - The server keeps track of basic stats about the player, such as the number of enemies killed and time spent in the game.
 - When a player dies, they see whether they win or lose, the number of enemies killed, and the time spent playing.
 - The player can go back to the Main Menu, where they can join the game again.
 - The players are added to a pre-game lobby where they wait for other players to join or where admins can force the game to start
 - Items were added to the game
 - Items have tooltips that show up when your mouse is over it
 - Players now collide with terrain
 - Bullets have a new texture
 - Added the full game cycle
 - Aliens were added to the game
 - Aliens spawn if you go into the storm
 - Game ends when there is only 1 player left
  
# Updates
 - Main menu is now colorful
 - The website colors have been updated to reflect the game better

# Bugfixes
 - Fixed missing font characters

## v2.0.0 beta
Date: April 19, 2019

---
## Additions
- Added a chat GameObject
- Added a ChatWindow GameObject that manages chat GameObjects
- Added a chat connection class to manage the connection and request for chat
- Added a server side chat class with a method for the simulation to hook into and send messages.
- Added the ability to have colors for the chat
- Added the ability to send chats to other people
- Added IMessage interface for message formats
- Added ICommand interface for command formats
- Nicknames are received from the session
- Sockets are disconnected if they do not have a valid session
- Added a GameObject for bullets
- Added functioning bullets
- Added collisions with the collidedWith method on each implementing IGameObject class
- The bodies in the physics simulation now have fixtures that are circles, so players can collide with each other.
- Helpful console.log statements for debugging the objects as represented in the physics simulation.
- Added new dashboard page with planned fields and layout
- Added ability to update your nickname using Ajax
- Added ability to confirm your email
- Added ability to change your password
- Added some Ajax helper functions
- Code editing was enforced with the addition of the .editorconfig file
- World now renders a tile map
- Added a perlin noise generator to make smooth terrain
- Added localhost option when starting the server


## Updates
- Updated the mouse to be a crosshair
- .VSCode folder is now in .gitignore
- Server game simulation resolution



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


