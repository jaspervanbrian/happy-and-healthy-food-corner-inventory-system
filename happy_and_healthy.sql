create database happy_and_healthy;
use happy_and_healthy;

create table users(
    `id` int auto_increment not null,
    `name` varchar(255) not null,
    `username` varchar(255) unique not null,
    `email_address` varchar(255) unique not null,
    `password` varchar(255) not null,
    `role` varchar(255) not null,
    `security_question` varchar(255) not null,
    `answer` varchar(255) not null,
    PRIMARY KEY (`id`)
);

create table stocks(
    `id` int auto_increment not null,
    `name` varchar(255) not null,
    `former_name` varchar(255),
    `category` varchar(255) not null,
    `unit` varchar(255) not null,
    `current_qty` float not null,
    `price` float not null,
    `last_price_changed` datetime,
    `supplier` varchar(255) not null,
    `supplier_location` varchar(255) not null,
    `last_supplier_changed` datetime,
    `status` varchar(255) not null,
    `is_deleted` boolean not null,
    `low_threshold` float not null,
    PRIMARY KEY (`id`)
);

create table particulars (
    `id` int auto_increment not null,
    `stock_id` int not null,
    `user_id` int not null,
    `type` varchar(255) not null,
    `supplier_reference` varchar(255),
    `in` float not null,
    `out` float not null,
    `balance` float not null,
    `price_balance` float not null,
    `date_time` datetime not null,
    PRIMARY KEY (`id`),
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)   
);

create table spoilages (
    `id` int auto_increment not null,
    `stock_id` int not null,
    `user_id` int not null,
    `supplier_reference` varchar(255),
    `amount` float not null,
    `balance` float not null,
    `price_balance` float not null,
    `date_time` datetime not null,
    PRIMARY KEY (`id`),
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)   
);

insert into users (name, username,email_address,password,role,security_question,answer)
values ('Admin', 'admin', 'admin@example.com', 'admin1234', 'admin', "What is your mother's maiden name?", "Admin");


select * from stocks;

SELECT ROUND(SUM(t1.`in`), 4) ins, ROUND(SUM(t1.`out`), 4) outs
FROM particulars t1
WHERE 
    t1.stock_id = 2 AND
    MONTH(t1.date_time) = MONTH(CURRENT_DATE()) AND
    YEAR(t1.date_time) = YEAR(CURRENT_DATE())
GROUP BY
    MONTH(t1.date_time), YEAR(t1.date_time), t1.stock_id
    
SELECT ROUND(SUM(t2.amount), 4) spoilages
FROM spoilages t2
WHERE
    t2.stock_id = 1 AND
    MONTH(t2.date_time) = MONTH(CURRENT_DATE()) AND
    YEAR(t2.date_time) = YEAR(CURRENT_DATE())
GROUP BY
    MONTH(t2.date_time), YEAR(t2.date_time), t2.stock_id