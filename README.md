# YubTub

A Firefox extension that makes YouTube videos fill the entire browser window by hiding the header, sidebar, and related videos. Also redirects YouTube Shorts to the normal watch page.

## Features

- Videos fill the entire browser window in theater mode
- Header, sidebar, and related videos are hidden
- Live chat panels are automatically closed
- YouTube Shorts are redirected to the normal watch page
- Press Escape to toggle the full-browser view on or off

## Install

1. Download `yubtub.xpi` from [releases](releases)
2. Open Firefox and drag the `.xpi` file into the browser
3. Confirm the installation prompt

## Development

### Load as temporary extension

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json`
