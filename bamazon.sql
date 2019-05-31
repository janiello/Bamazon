create database bamazon;

use bamazon;

create table products (
	item_id integer(10) auto_increment not null,
    product_name varchar(100) null,
    department_name varchar(100) null,
    price decimal (10, 2) null,
    stock_quantity integer(10),
    primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ("Xbox One X", "Electronics", 299, 10);

insert into products (product_name, department_name, price, stock_quantity)
values ("Cards Against Humanity", "Games", 50, 20);

insert into products (product_name, department_name, price, stock_quantity)
values ("Maytag Washing Machine", "Appliances", 689.89, 4);

insert into products (product_name, department_name, price, stock_quantity)
values ("8 pc. Steak Knife Set", "Home and Kitchen", 59.99, 5);

insert into products (product_name, department_name, price, stock_quantity)
values ("Burton Process Flying V Snowboard", "Sports and Fitness", 499.95, 1);

insert into products (product_name, department_name, price, stock_quantity)
values ("Maytag Dryer", "Appliances", 689.89, 4);

insert into products (product_name, department_name, price, stock_quantity)
values ("Giant Jenga", "Games", 40, 15);

insert into products (product_name, department_name, price, stock_quantity)
values ("Samsung 8k 75-inch TV", "Electronics", 2349.95, 2);

insert into products (product_name, department_name, price, stock_quantity)
values ("Phone case for Google Pixel", "Phones and Accessories", 10, 50);

insert into products (product_name, department_name, price, stock_quantity)
values ("Taylormade Iron Set", "Golf", 400, 1);

select * from products;