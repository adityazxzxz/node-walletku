copy .env.example to .env
npm install

update mysql.cnf set max_allowed_packet=10M

npm run dev

USER STATUS
0 = phone registered
1 = personal data saved
2 = document saved & ready to observate 
3 = approved or ready to transaction
4 = banned



# QUERY FOR APPROVED TO TRANSACTION
UPDATE customers SET status = 3 WHERE phone = '{YOUR_NUMBER}'

# QUERY FOR ADD Balance
UPDATE customers SET balance = balance + {NUMBER_OF_BALANCE} WHERE phone = '{YOUR_NUMBER}'

# QUERY FOR Change LIMIT
UPDATE customers SET limit = {NUMBER_OF_LIMIT} WHERE phone = '{YOUR_NUMBER}'