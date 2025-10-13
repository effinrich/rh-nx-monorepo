create table role (
    id int8, 
    authority varchar(255) NOT NULL,
    display_name varchar(255),
    PRIMARY KEY (id),
    UNIQUE (authority)
);

create table person_roles (
    person_id int8 not null REFERENCES person,
    roles_id int8 not null REFERENCES role, 
    primary key (person_id, roles_id)
);

INSERT INTO ROLE (id, authority, display_name) VALUES (nextval('hibernate_sequence'), 'ROLE_RH_ADMIN', 'RH Admin');
INSERT INTO ROLE (id, authority, display_name) VALUES (nextval('hibernate_sequence'), 'ROLE_RH_USER', 'RH User');
INSERT INTO ROLE (id, authority, display_name) VALUES (nextval('hibernate_sequence'), 'ROLE_OP_CO_USER', 'OpCo User');
INSERT INTO ROLE (id, authority, display_name) VALUES (nextval('hibernate_sequence'), 'ROLE_OP_CO_CONTRACTOR', 'OpCo Contractor');