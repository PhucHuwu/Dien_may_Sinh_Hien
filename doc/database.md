## Users

+------------------+
| users            |
+------------------+
| id (PK)          |
| fullname         |
| email            |
| phone            |
| password_hash    |
| role             |
| created_at       |
+------------------+

## Addresseses

+---------------------------+
| addresses                 |
+---------------------------+
| id (PK)                   |
| user_id (FK → users.id)   |
| full_address              |
| receiver_name             |
| receiver_phone            |
| is_default                |
+---------------------------+

## Categories

+---------------------------+
| categories                |
+---------------------------+
| id (PK)                   |
| name                      |
| parent_id (FK self)       |
+---------------------------+

## Products

+------------------------------------------+
| products                                 |
+------------------------------------------+
| id (PK)                                  |
| category_id (FK → categories.id)         |
| name                                     |
| description                              |
| brand                                    |
| warranty_months                          |
| base_price                               |
| discount_percent                         |
| stock                                    |
| created_at                               |
+------------------------------------------+

## Products_image

+---------------------------------+
| product_images                  |
+---------------------------------+
| id (PK)                         |
| product_id (FK → products.id)   |
| image_url                       |
| is_thumbnail                    |
+---------------------------------+

## Oders

+-----------------------------------------+
| orders                                  |
+-----------------------------------------+
| id (PK)                                 |
| user_id (FK → users.id)                 |
| address_id (FK → addresses.id)          |
| status                                  |
| total_amount                            |
| created_at                              |
+-----------------------------------------+

## Order_items

+------------------------------------------------+
| order_items                                    |
+------------------------------------------------+
| id (PK)                                        |
| order_id (FK → orders.id)                      |
| product_id (FK → products.id)                  |
| variant_id (FK → product_variants.id)          |
| price                                          |
| quantity                                       |
+------------------------------------------------+
