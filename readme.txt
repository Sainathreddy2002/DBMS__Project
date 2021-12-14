Database Management Systems(CS308) PROJECT

Project Name:-Online Airways Reservation System 

Idea:-To Design an Online Airways Reservation System which is funtional to the passengers.

Team Members:-Hruday Reddy(19XJ1A0546)
              Sainath Reddy(19XJ1A0547)
              Pranav Reddy(19XJ1A0553)

Front End:HTML,CSS
Back End:Node.js
Database:MySQL

Features of the Project:-

-Passengers can select their desired starting and destination cities,number of seats,date of travel and flight of their choice(in the available flights)
-Passengers can select their desired payment option.
-Payment confirmation is sent to your email. 

Various Pages:-

Login Page:-Allows the user to login(if he already has a account in the website)

Create New Account Page:-Allows a non-existing user to create a new account,so that he can login directly from the next time

Flight Booking Page:-Allows the user to select the starting and the destination cities,date of travel,number of seats and flight of their choice.

Passenger Information Page:-Asks for passengers details in order to print it on the ticket

Select Payment Method Page:-Allows the user to select their desired payment option to pay for the ticket.

Database Details:-

USER TABLE:
-ID
-EMAIL ID - CUSTOMER PASSWORD

FLIGHTINFO TABLE:
FLIGHT ID -START CITY -DESTINATION -TIMETAKEN -PRICE -FLIGHT DEPARTURE TIME -FLIGHT ARRIVAL TIME

CITY DETAILS TABLE:
CITY ID -CITY NAME -COUNTRY NAME -AIRPORT NAME

PAYMENT DETAILS:
TRANSACTION ID -EMAIL -CARD NUMBER -CARDOWNER NAME -BANKNAME -UPI ID -START CITY -DESTINATION -STARTTIME -REACHTIME -PRICE -PNR -BOOKIN STATUS -PASSENGER NAME 
Points to Note while executing:-

1)While selecting the starting and destination city you need to press the down arrow beside the select city button and same for selection of date and number of seats button

2)For passenger details and payment details the user needs to fill all the textfields

NODE.js:
Used node.js to connect databases and frontend and also update,read,add,delete values from the database.
 

   
