
# Decrypting and encrypting claims stored in DynamoDB

In DynamoDB, we have tables that store the claims of users in a Fernet-key encrypted
format. The staging and production tables have their own Fernet keys used for encryption,
and they can be found in the 1PW entries mentioned in the script. This script helps us 
decrypt existing claims, update if needed, and then encrypt them again.

1. To decrypt the string stored in the `claims` field, run:
```shell
$ python3 claims.py -a decrypt -k <the Fernet key>
```
2. Edit the decrypted output as needed and, then, to encrypt, run:
```shell
$ python3 claims.py -a encrypt -k <the Fernet key>
```
3. Update the `claims` field value for the row in the DynamoDB table
