#!/usr/bin/env python3

import json
import os

payload = os.environ.get('INCOMING_HOOK_BODY')
decoded_vars = json.loads(payload)

for var in decoded_vars:
        print(var + ': ' + decoded_vars[var])
