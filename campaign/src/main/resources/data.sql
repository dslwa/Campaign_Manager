-- Data seed bez konfliktów duplikatu PK

-- Kampanie (upsert po id)
MERGE INTO campaign (id, name, bid_amount, campaign_fund, status, town, radius_km)
    KEY(id)
    VALUES
        (1, 'Shoes Sale', 0.50, 100.00, TRUE,  'Warsaw',   10),
        (2, 'Summer Hats', 0.30,  50.00, TRUE,  'Cracow',   20),
        (3, 'Book Bonanza', 0.10, 200.00, FALSE, 'Berlin',   15),
        (4, 'Gadget Gala',  1.00, 300.00, TRUE,  'Helsinki', 30),
        (5, 'Electronics Expo', 0.75, 150.00, FALSE, 'Barcelona',25),
        (6, 'Gaming Gear',  0.60, 120.00, TRUE,  'Milan',    12),
        (7, 'Clothing Carnival', 0.40,  80.00, TRUE,  'London',   18),
        (8, 'Back-to-School', 0.20,  60.00, TRUE,  'Paris',    22),
        (9, 'Winter Coats', 0.90, 250.00, FALSE, 'Rome',     35),
        (10,'Sports Equipment', 0.55, 110.00, TRUE,  'Madrid',   14);

-- Słowa kluczowe (upsert po campaign_id i keyword)
MERGE INTO campaign_keyword (campaign_id, keyword)
    KEY(campaign_id, keyword)
    VALUES
        (1, 'shoes'),      (1, 'sale'),      (1, 'footwear'),
        (2, 'hats'),       (2, 'summer'),    (2, 'sun'),
        (3, 'books'),      (3, 'reading'),   (3, 'education'),
        (4, 'gadgets'),    (4, 'electronics'),
        (5, 'expo'),       (5, 'tech'),
        (6, 'gaming'),     (6, 'consoles'),
        (7, 'clothing'),   (7, 'fashion'),
        (8, 'school'),     (8, 'stationery'),
        (9, 'coats'),      (9, 'winter'),
        (10, 'sports'),    (10, 'equipment'),(10, 'fitness');
