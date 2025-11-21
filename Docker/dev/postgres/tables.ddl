create table users (
      userid           int4            generated always as identity
    , firstname        varchar(128)    not null
    , middleinitials   varchar(32)
    , lastname         varchar(128)
    , email            varchar(256)    not null
    , password         varchar(128)    not null
    , rights           int4            not null default 0

    , constraint userid_pk      primary key (userid)
    , constraint unique_email   unique (email)
);

