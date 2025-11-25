insert into users (firstname, lastname, email, password, rights) values
(
    'Bob',
    'Simpson',
    'bob@fakeuser.com',
    '$2a$12$HAWJ4GL84J8kxxcmcyYPPeBn7Q8dvHX63nFA2BdBVESI8anSOFOwS',
    7
);

insert into filetype (name, extension, editable, indexable, diffable) values ('PDF', 'pdf', true, true, true);
insert into filetype (name, extension, editable, indexable, diffable) values ('Microsoft Word', 'docx', false, true, false);

insert into doctype (name, status) values ('Procedure', 0);
insert into doctype (name, status) values ('Policy', 0);
