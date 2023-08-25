copy .env.example to .env
npm install

update mysql.cnf set max_allowed_packet=10M

npm run dev
