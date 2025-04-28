CREATE DATABASE dangnhapdangky;
USE dangnhapdangky;

CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20),
    email VARCHAR(255),
    password VARCHAR(255)
);
