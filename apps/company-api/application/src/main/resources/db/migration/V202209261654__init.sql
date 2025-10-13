CREATE TABLE operating_company (
    id int8,
    name varchar(255), 
    slug varchar(255) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(slug)
);

create table person (
    id int8, 
    email varchar(255) NOT NULL, 
    family_name varchar(255), 
    given_name varchar(255), 
    PRIMARY KEY (id),
    UNIQUE (email)
);

CREATE TABLE operating_company_members (
    member_of_id int8 REFERENCES operating_company,
    members_id int8 REFERENCES person, 
    PRIMARY KEY (member_of_id, members_id)
);

create sequence hibernate_sequence start 1 increment 1;