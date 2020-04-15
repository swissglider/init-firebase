# init-firestore-rules
Init the firestore rules for a new app - template

## Description:
This project includes the base firestore rules I use in my apps and all the tests for it.  
To use this rules, just inport it into your Firestore project.  
To use the admin roles in an app, you need to give the rigth rigts to some users.

In the firestore you already need to have the following Collection/Documents:  
- authGroup/theAutGroup (with the groups Array),
- authRole/theAuthRole/roles with the following roles:  
    | Role           | Description |
    |----------------|-------------|
    | admin          | - can do everythining|
    | authWriter     | - able to do everything|
    |                | - but not read/write any admin users,
    |                | - can also not give himself admin
    | authRead       | - able to read everything
    | documentsAdmin | - able to change all document entries and delete them
    | moderator      | - able to change all document entries and delete them, 
    |                | - but can not change the owner
    | editor         | - able to change all document entires 
    |                | - but can not delete or change any group or owner


### Database Diagramm
![..](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/swissglider/init-firebase/master/schema/db.wsd)


