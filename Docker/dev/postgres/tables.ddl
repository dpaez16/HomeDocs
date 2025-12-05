create table users (
      userid           int4            generated always as identity
    , firstname        varchar(128)    not null
    , middleinitials   varchar(32)
    , lastname         varchar(128)
    , email            varchar(256)    not null
    , password         varchar(128)    not null
    , rights           int4            default 1 not null

    , constraint userid_pk      primary key (userid)
    , constraint unique_email   unique (email)
);

create table filetype (
        filetypeid          int4                generated always as identity
      , name                varchar(256)        not null
      , editable            boolean             not null
      , indexable           boolean             not null
      , diffable            boolean             not null
      , extension           varchar(32)         not null
      , is_canonical        boolean             not null

      , constraint filetypeid_pk primary key (filetypeid)
);

create unique index unique_extension on filetype (lower(extension));

create table doctype (
      doctypeid         int4            generated always as identity
    , name              varchar(256)    not null
    , status            int2            not null

    , constraint doctypeid_pk primary key (doctypeid)
    , constraint name_unique unique (name)
);

create table doctemplate (
      doctemplateid     int4            generated always as identity
    , doctypeid         int4            not null
    , name              varchar(256)    not null
    , status            int2            not null

    , constraint doctemplateid_pk primary key (doctemplateid)
    , constraint doctypeid_name_unique unique (doctypeid, name)
    , foreign key (doctypeid) references doctype (doctypeid) on delete cascade
);

create table associated_filetypes (
      doctemplateid int4 not null
    , filetypeid int4 not null

    , constraint doctemplateid_filetypeid_unique unique (doctemplateid, filetypeid)
    , foreign key (doctemplateid) references doctype (doctypeid) on delete cascade
    , foreign key (filetypeid) references filetype (filetypeid) on delete cascade
);

create table document (
      documentid        int4            generated always as identity
    , ownerid           int4            not null

    , constraint documentid_pk primary key (documentid)
    , foreign key (ownerid) references users (userid) on delete cascade
);

create table documentrevision (
      documentrevisionid    int4                        generated always as identity
    , documentid            int4                        not null
    , revnum                int4                        not null
    , title                 varchar(256)                not null
    , ownerid               int4                        not null
    , docstatus             int2                        not null
    , doctypeid             int4                        not null
    , doctemplateid         int4                        not null
    , createdt              timestamp with time zone    not null
    , officialdt            timestamp with time zone
    , archiveddt            timestamp with time zone
    , notes                 varchar(1024)
    , keywords              varchar(512)

    , constraint documentrevisionid_pk primary key (documentrevisionid)
    , constraint documentrevision_title_unique unique (title)
    , foreign key (documentid) references document (documentid) on delete cascade
    , foreign key (ownerid) references users (userid) on delete cascade
    , foreign key (doctypeid) references doctype (doctypeid) on delete cascade
    , foreign key (doctemplateid) references doctemplate (doctemplateid) on delete cascade
);

create table documentblob (
      documentblobid        int4
    , contents              bytea
    , contents_vec          tsvector
    , contents_text         text

    , constraint documentblobid_pk primary key (documentblobid)
);

create sequence documentblobid start with 1 increment by 1 no cycle;

create table subrevision (
      subrevisionid         int4                        generated always as identity
    , documentrevisionid    int4                        not null
    , subrevnum             int4                        not null
    , documentblobid        int4                        not null
    , userid                int4                        not null
    , createdt              timestamp with time zone

    , constraint subrevisionid_pk primary key (subrevisionid)
    , constraint documentrevisionid_subrevnum_unique unique (documentrevisionid, subrevnum)
    , foreign key (documentrevisionid) references documentrevision (documentrevisionid) on delete cascade
    , foreign key (documentblobid) references documentblob (documentblobid) on delete cascade
    , foreign key (userid) references users (userid) on delete cascade
);

create table manual (
      manualid      int4            generated always as identity
    , title         varchar(256)    not null
    , ownerid       int4            not null
    , status        int2            not null

    , constraint manualid_pk primary key (manualid)
    , constraint manual_title_unique unique (title)
    , foreign key (ownerid) references users (userid) on delete cascade
);

create table manualdocs (
      manualid      int4    not null
    , documentid    int4    not null

    , foreign key (manualid) references manual (manualid) on delete cascade
    , foreign key (documentid) references document (documentid) on delete cascade
    , constraint manualid_docid_unique unique (manualid, documentid)
);
