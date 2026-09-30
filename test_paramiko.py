import paramiko
import sys

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    print("Attempting connection to 200.97.163.236...")
    client.connect(
        hostname="200.97.163.236",
        port=22,
        username="root",
        password="Photoshop09@",
        timeout=15,
        look_for_keys=False,
        allow_agent=False
    )
    print("CONNECTION SUCCESSFUL!")
    stdin, stdout, stderr = client.exec_command("whoami && pwd && pm2 status")
    print("STDOUT:\n" + stdout.read().decode())
    print("STDERR:\n" + stderr.read().decode())
    client.close()
except paramiko.AuthenticationException as e:
    print(f"AUTH FAILED: AuthenticationException: {e}")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
