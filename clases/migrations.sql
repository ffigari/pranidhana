alter table users add constraint unique_username UNIQUE (username);


INSERT INTO users (id, username)
SELECT
    uuid_generate_v4(),
    (
        arr1[ceil(random() * array_length(arr1, 1))] || '_' ||
        arr2[ceil(random() * array_length(arr2, 1))] || '_' ||
        floor(random() * 1000)::text
    ) AS username
FROM
    generate_series(1, 200),
    LATERAL (
        SELECT 
            ARRAY[
                'mate', 'asado', 'gaucho', 'pampero', 'quilmes', 'tango', 
                'porteño', 'yerba', 'chimango', 'sur', 'rio', 'pampa',
                'córdoba', 'rosarino', 'salteño', 'zonda'
            ] AS arr1,
            ARRAY[
                'prana', 'asana', 'zen', 'mudra', 'chakra', 'dhyana',
                'sutra', 'mantra', 'kundalini', 'samadhi', 'shanti'
            ] AS arr2
    ) AS words;


INSERT INTO teachers (user_id)
SELECT id
FROM users
ORDER BY random()
LIMIT 50;
