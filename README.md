# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview

For the **Restaurant Reviews** projects, I incrementally converted a static webpage to a mobile-ready offline-first web application.

### Specification
I have been provided the code for a restaurant reviews website. The code had a lot of issues. It was barely usable on a desktop browser, much less a mobile device. It also didn't include any standard accessibility features, and it didn't work offline at all. My job was to update the code to resolve these issues while still maintaining the included functionality.

#### Stage 1
I took a static design that lacks accessibility and converted the design to be responsive on different sized displays and accessible for screen reader use. Also, I added a service worker to begin the process of creating a seamless offline experience for users.

#### Stage 2
I took the responsive, accessible design built in Stage One and connected it to an external server. I began by using Fetch API to request JSON data from the server. Then I stored data received from the server in an offline database using IndexedDB, which created an app shell architecture. Finally, I optimized app to meet performance score of 70 using Lighthouse.

#### Stage 3
I added a form to allow users to create their own reviews. If the app is offline, the form defers updating to the remote database until a connection is established. Finally, I optimized the site to meet even stricter performance benchmarks, scoring over 90 on Lighthouse.

## How to run
### 1. Clone repository
``` bash
git clone https://github.com/jasonbaciulis/mws-restaurant-reviews.git
```

### 2. Setup node server
This app uses remote node server to fetch data so you'll also need to set it up. Go to [mws-restaurant-stage-3](https://github.com/udacity/mws-restaurant-stage-3) repository and follow intructions in the decription.

### 3. Install npm dependencies

``` bash
npm install
```

### 4. Run the app

Although this project uses gulp with browsersync it may create unusual requests for `sw.js` so in that case serve files with Python.

In `/dist` folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python.

For most people, it's already installed on your computer. In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`.

If you're a Windows user and having trouble running Python then try `py -m http.server 8000`.

If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

### 4. Start a browser
With your Python and node servers running, visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.

#### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code.



