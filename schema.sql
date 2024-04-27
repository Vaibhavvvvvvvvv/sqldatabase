create table practice (
    id varchar(50) primary key,
    username varchar(50) not null,
    email varchar(50) not null unique,
    password varchar(50) not null
);


