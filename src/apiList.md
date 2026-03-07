# devTinder

## authRouter
-post /signup
-post /login
-post /logout

## profileRouter
-get /profile/view
-patch /profile/edit
-patch /profile/password

## connectionRequest
-post /request/send/interested/:userId
-post /request/send/ignored/:userId
-post /request/review/accepted/:requestId
-post /request/review/rejected/:requestId

-get /user/connection
-get /user/requests
-get/feed  -gets you the profiles of other user on platform