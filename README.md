Link to deployed app: http://petminder.github.io/petminder-frontend/
Link to back end repo: https://github.com/Petminder/petminder-backend

Mock up for Loggedin Site State

![petminder-logged-in](https://cloud.githubusercontent.com/assets/12531471/11940915/b87b3eaa-a7f9-11e5-9e0d-b4fef25986be.png)


ERD:
A User has_many dogs
A Pet belongs_to user

Future ERD:
Petss has_many documents
Document belongs_to Pet


Technologies:
It started out as a more general Petminder.  Then I quickly realized I didn't know how to take care of a cat or a bird so I went with the animal I knew.  This app is for everyone who loves their dog and wants to provide the best care, which means keeping them up to date on vaccinations and monthly medicines.  I know I forget if I did it on the 2nd or the 12th or the 20th.  I wanted to provide a place where dog owners can keep track of their best friends health.

I built this app with a PostgreSQL database with a Rails back end and utilized a Bootstrap template and used Handlebars to render the page.  This was the first time I used Handlebars to render data.

I chose Rails and PostgreSQL because they play well together and I felt more comfortable completing the assignment with this type of backend.  I like the structure that Rails provides and the way relationships are maintained and established and how references to other tables work.


Future Plans:
In the future I would like the application to store important documents and be able to create a countdown to next medicine application or vaccination.  If not a count down, something like an email or text reminder a day before the event.


User Stories:
C-
As a User I want to be able to log in
As a User I want to be able to register
As a User I want to be able to add a dog

R-
As a User I want to be able to get a list of only my dogs

U-
As a User I want to be able to change any parameter of my dog (name, dob, last tick, last rabies, last heartworm)

D-
As a User I want to be able to remove a dog from my list :(
As a User I want to be able to remove some data from my dog


Stretch CRUD:
C-
As a User I want to be able to create a specific landing site for each dog
As a User I want to be able to upload important documents (like rabies vaccinations forms)

R-
As a User I want to be able to see when the next shot or medicine application should be done
As a User I want to be able to grant access rights to another person

U-
As a User I want to be able to update the profile picture
As a User I want to be able to make the profile picture the background image of the dog specific landing site

D-
As a User I want to be able to delete documents attached to the dog
