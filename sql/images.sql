DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/MQwozP4QM5uK84XgPs4Q0oUIVWiwzN-w.jpg',
    'funkychicken',
    'Welcome to Berlin and the future!',
    'This photo brings back so many great memories.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
    'discoduck',
    'Elvis',
    'We can''t go on together with suspicious minds.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
    'discoduck',
    'Hello Berlin',
    'This is going to be worth a lot of money one day.'
);

SELECT * FROM images
WHERE id < $1
ORDER BY id DESC
LIMIT 20;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR(500),
    username VARCHAR(50),
    image_id INT NOT NULL,
);
