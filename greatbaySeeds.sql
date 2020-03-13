DROP DATABASE IF EXISTS greatbay_db;

CREATE DATABASE greatbay_db;

USE greatbay_db;

CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT,
  itemName VARCHAR(45) NULL,
  bid INT DEFAULT 0,
  PRIMARY KEY (id)
);

INSERT INTO items (itemName, bid)
VALUES ("Basketball", 20);

INSERT INTO items (itemName, bid)
VALUES ("VHS Player", 6);