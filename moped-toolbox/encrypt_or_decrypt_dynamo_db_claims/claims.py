#!/usr/bin/env python3
"""
Helper to decrypt, edit, and then encrypt Dynamo DB claims. You can 
find the environment specific Fernet keys in the 1Password entries named
'Moped - Production - Encryption Key - Secrets Manager - Cognito' and
'Moped - Staging - Encryption Key - Secrets Manager - Cognito'
"""
import argparse
import json
from cryptography.fernet import Fernet


def encrypt(key):
    token = input("Enter the claims to encrypt:")

    f = Fernet(key)
    byte_string_input = token.encode()
    byte_string_output = f.encrypt(byte_string_input)
    print("\nPlace this in the Dynamo DB table claims field\n")
    print(str(byte_string_output, encoding="utf-8"))


def decrypt(key):
    token = input("Enter the encrypted claims to decrypt from: ")

    f = Fernet(key)
    byte_string = f.decrypt(token)
    string = str(byte_string, encoding="utf-8")
    print("\nDecrypted claims to edit and then encrypt:")
    print(f"\n{string}")


def main(args):
    if args.action == "encrypt":
        encrypt(args.key)
    elif args.action == "decrypt":
        decrypt(args.key)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-a",
        "--action",
        required=True,
        type=str,
        choices=["encrypt", "decrypt"],
        help=f"Encrypt or decrypt the claims",
    )
    parser.add_argument(
        "-k",
        "--key",
        type=str,
        required=True,
        help=f"The Fernet key for the environment",
    )

    args = parser.parse_args()

    main(args)
