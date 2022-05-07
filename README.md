<div align="center">
  <img alt="papirus logo" width=60 src="https://user-images.githubusercontent.com/67826350/167264314-37a40867-3921-4762-a4aa-56268fd9d4cc.png">
  <h1 align="center">Papirus</h1>

</div>

<img align="center" alt="papirus dashboard" src="https://user-images.githubusercontent.com/67826350/167264339-c9a91e51-9a26-4943-9abc-16dcff49206c.jpg">
<p align="center">Simple but powerful note-taking app, built for people who likes simplicity.</p>
<p>
  <div align="center">
    <a href="https://papirus.wastu.dev">Demo</a>
  </div>
</P>
<p align="center">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/bagaswastu/papirus">
  <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/bagaswastu/papirus?include_prereleases">
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/bagaswastu/papirus">
</p>

I built Papirus with **Next.js** & **Appwrite** to participate in the [hackathon competition held by Appwrite and DEV](https://dev.to/devteam/announcing-the-appwrite-hackathon-on-dev-1oc0).

# Description

Papirus is a simple note-taking app that allows you to write, edit, delete and share your notes or snippets without much friction.

Papirus was designed for individuals who didn't bother organizing their notes and relied more on the search feature. So, no more tags, labels, or folders.

Papirus is inspired by the simplicity of Google Keep and Notion's easy-to-write editor.

# Features

- WYSIWYG editor with a markdown keyboard shortcut
- Searchable notes
- Share notes publicly
- Keyboard-centric navigation
- Dark mode 🌙

# Screenshots

- [Screenshot 1](https://raw.githubusercontent.com/bagaswastu/papirus/main/assets/screenshot1.jpg)
- [Screenshot 2](https://raw.githubusercontent.com/bagaswastu/papirus/main/assets/screenshot2.jpg)
- [Screenshot 3](https://raw.githubusercontent.com/bagaswastu/papirus/main/assets/screenshot3.jpg)

# Building the app

## Set up Appwrite

- Make sure you have Appwrite installed
- Create new collections and add this attribute:
  - content: string - required
  - timestamp: string - required
  - text: string - required
- Add full-text index for `text` attribute
- Add your app url to `platforms`

## Running the project

- Copy `.env.example` to `.env` and change the values to your Appwrite credentials
- Run `yarn && yarn dev`

# Issues

If you encounter any problems, you can open an issue on [GitHub](https://github.com/bagaswastu/papirus/issues).

# License

[Apache License 2.0](LICENSE)
