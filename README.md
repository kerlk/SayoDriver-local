
# SayoDriver-local

Portable version of SayoDevice official website.

## Start

```bash
# Clone the repository
git clone https://github.com/kerlk/SayoDriver-local.git

# Navigate to project directory
cd SayoDriver-local

# Start HTTP server (Python 3)
python -m http.server 8000 #you can use any port
```

## Usage

After starting the server, open your browser and navigate to:
```
http://localhost:8000
```

## Notes

- For Python 2.x (legacy), use: `python -m SimpleHTTPServer 8000`
- Press `Ctrl+C` to stop the server

## Links

- [Official SayoDevice Website](https://sayodevice.com/)
- [Original Repository](https://github.com/kerlk/SayoDriver-local)

##P.S.
Why did i do this? Because the Sayodevice website sometimes simply refuses to load for me without a VPN; the page takes over a minute to load. But everyone will find their use. I also installed all the firmware locally for all Sayodevice devices, and updating them won't require internet access.
```
