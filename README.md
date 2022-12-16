## Kotol API Documentation :page_facing_up:

https://kotol-be.herokuapp.com

#### -Users



###**/users/register** 
register user

:large_orange_diamond: POST
        

        body {
            "name":"Šimon",
            "surname": "Kováč",
            "email": "example@email.com",
            "password":"1234"

            }

###**/users/login** :link:
login user

:large_orange_diamond: POST

        body {
            "email": "example@email.com",
            "password":"1234"

            }
        
        example respone {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_lH0lvi",
            "refreshToken": "3MTgxNDA0MX0.K9JSkL_1pbJeNvvOFyxEed-gacw6d"
        }
###**/users/googleLogin** :link:
login user

:white_check_mark: GET

        example respone {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_lH0lvi",
            "refreshToken": "3MTgxNDA0MX0.K9JSkL_1pbJeNvvOFyxEed-gacw6d"
        }
###**/users** :link:
list of all users

:white_check_mark: GET :heavy_exclamation_mark: |  Admin JWT required

        example response {
            _id":"633bec9c6e604bf728925c51",
            "name":"Simon",
            "surname":"Kovac",
            "email":"example@mail.com",
            "role":"customer",
            "createdAt":"2022-10-04T08:19:40.052Z"
            
            }

###**/users/me** :link:
info for single account

:white_check_mark: GET :heavy_exclamation_mark: | JWT required

        example response {
            _id":"633bec9c6e604bf728925c51",
            "name":"Simon",
            "surname":"Kovac",
            "email":"example@mail.com",
            "role":"customer",
            "createdAt":"2022-10-04T08:19:40.052Z"
            "favorites":[],
            "orders":[]
            
            }
###**/pin/reset-password** :link:
request reset password pin

:large_orange_diamond: POST

        body {
            "email": "example@mail.com"

            }
        
        as a response a pin will be sent to example.@mail.com
        

###**/users/password-reset** :link:
reset password

:black_medium_square: PATCH 

        body {
            "email": "example@mail.com",
            "pin": "691763",
            "newPassword":"1234"

            }

###**/users/refresh-tokens** :link:
reset password

:large_orange_diamond: POST 

        body {
            "refreshToken": "3MTgxNDA0MX0.K9JSkL_1pbJeNvvOFyxEed-gacw6d"

        }
        
        new refresh and access tokens {
            "accessToken": "eyAAhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_lH0l",
            "refreshToken": "eyAAgxNDA0MX0.K9JSkL_1pbJeNvvOFyxEed-gacw"

        }


