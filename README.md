# Password Generator

A simple, secure password generator that runs entirely in your browser. Choose the length and character types, generate a password, and copy it with one click.

Built with plain HTML, CSS and JavaScript. No frameworks, no backend, and nothing is ever sent to a server.

## Features

- Length from 6 to 32 characters
- Choose uppercase, lowercase, numbers and symbols
- Always includes at least one character from each selected type
- Uses the browser's secure random generator (`crypto.getRandomValues`)
- Strength meter
- One-click copy to clipboard
- Recent passwords list (kept only for the current browser tab session)
- Dark mode (remembers your choice)
- Responsive layout for phones and desktops

## Getting started

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/password-generator.git
   ```
2. Open `index.html` in your browser. That's it.

## Project structure

```
password-generator/
├── index.html   # page structure
├── style.css    # styling and dark mode
├── script.js    # generator logic
└── README.md
```

## Live demo

Enable GitHub Pages (Settings > Pages > Deploy from branch > `main`) and add your link here:

`https://<your-username>.github.io/password-generator/`

## What I learned

- Working with form controls (range slider, checkboxes)
- Why `crypto.getRandomValues` is safer than `Math.random` for passwords
- The Fisher-Yates shuffle
- Using the Clipboard API
- `sessionStorage` vs `localStorage`

## Future improvements

- Passphrase mode (random words)
- Option to exclude look-alike characters (O, 0, l, 1)
- Show an estimate of how long the password would take to crack
- Keyboard shortcut to generate

## License

MIT
