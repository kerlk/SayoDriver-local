import subprocess, webbrowser, time, sys

PORT = 80
subprocess.Popen([sys.executable, "-m", "http.server", str(PORT)])
time.sleep(2)
webbrowser.open(f"http://localhost:{PORT}")
print(f"Server running on port {PORT}")
subprocess.wait()