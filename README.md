# img-gen

change something

Simple Node.js webserver that returns a randomly generated PNG image on each request.

Requirements

- Node.js (14+ recommended)

Install

Open a terminal in the project folder and run:

```powershell
npm install
```

Run

```powershell
npm start
```

Then open http://localhost:3000 in your browser or fetch with curl/wget to receive a PNG image.

Quick test (PowerShell):

```powershell
npm start &
# wait a second, then
Invoke-WebRequest http://localhost:3000 -OutFile test.png
# stop the server by terminating the background job or closing the terminal
```

Notes

- Images are generated with the `jimp` library.
- Each request produces a new, unique image.

Optional improvements:
- Add caching, query-based seeds, or multiple sizes/endpoints.
