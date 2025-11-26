insert into users (firstname, lastname, email, password, rights) values
(
    'Bob',
    'Simpson',
    'bob@fakeuser.com',
    '$2a$12$HAWJ4GL84J8kxxcmcyYPPeBn7Q8dvHX63nFA2BdBVESI8anSOFOwS',
    7
);

insert into filetype (name, extension, editable, indexable, diffable, is_canonical) values ('HTML', 'html', true, true, true, true);
insert into filetype (name, extension, editable, indexable, diffable, is_canonical) values ('Markdown', 'md', true, true, true, true);
insert into filetype (name, extension, editable, indexable, diffable, is_canonical) values ('Microsoft Word (doc)', 'doc', false, true, false, true);
insert into filetype (name, extension, editable, indexable, diffable, is_canonical) values ('Microsoft Word (docx)', 'docx', false, true, false, true);
insert into filetype (name, extension, editable, indexable, diffable, is_canonical) values ('PDF', 'pdf', true, true, true, true);
insert into filetype (name, extension, editable, indexable, diffable, is_canonical) values ('Plaintext', 'txt', true, true, true, true);

insert into doctype (name, status) values ('Procedure', 0);

insert into doctemplate (doctypeid, name, status)
values
(
    (select doctype.doctypeid from doctype where doctype.name = 'Procedure'),
    'HTML',
    0
);


insert into doctemplate (doctypeid, name, status)
values
(
    (select doctype.doctypeid from doctype where doctype.name = 'Procedure'),
    'Microsoft Word',
    0
);

insert into doctemplate (doctypeid, name, status)
values
(
    (select doctype.doctypeid from doctype where doctype.name = 'Procedure'),
    'PDF',
    0
);
