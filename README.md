# Open Filament Database by SimplyPrint
The Open Filament Database, facilitated by SimplyPrint.

## ✅ Contributing: how to add to the database
The beautiful thing about the database is that anyone it's open source so anyone can contribute, whether you're a hobbyist, print farm or brand.

The steps to contribute to the database are simple but may get technical at times depending on how you want to do it, don't worry if you don't all understand terms, we'll guide you through it.

### So what are the steps?
1. **Create a GitHub account**
2. **Create a copy of the database** (commonly known as forking this repository)
3. **Install a few small applications** (Git, Python, Node.js)
4. **Download your copy of the database** (commonly known as cloning it).
5. **Use either our simple web configurator or use the manual method of text file manipulation**
6. **Check if your data has errors using computer magic**
7. **Upload your data and make a `pull request`**

### Let's do it!
1. If you don't already have one, create a GitHub account by following the prompts [in this link](https://github.com/signup).
2. Fork this database, A guide is [available here if needed](docs/forking.md)
3. If you don't have have Git, Python and Nodejs/NPM installed [there's a guide available here](docs/installing-software.md).
4. Get your database onto your computer, [use this guide if unsure](docs/cloning.md)
```bash
git clone https://github.com/YOUR_USERNAME/open-filament-database.git
cd open-filament-database
git checkout -b YOUR_BRANCHNAME
```
5. To use the web configurator simply run these commands or [follow the guide](docs/webui.md), if you want to do it manually you can [use this one](docs/manual.md)
```bash
cd webui
npm install
npm run dev
```
and access it in your browser at http://localhost:5173

6. Once you've finished modifying the database you can use these commands or [this guide](docs/validation.md) to make sure your data is correct, fix any errors that pop up
```bash
python data_validator.py --folder-names # Validates folder names.
python data_validator.py --json-files # Validates json files.
python data_validator.py --store-ids # Validates store ids.
```
7. To get your local database into ours you'll have to get your local data into the cloud and make a `pull request`, which we will then approve.
Start by running these commands, filling in your data instead of the yelling text, of course.
```bash
git add .
git commit -m "INSERT WHAT YOU DID"
git push –u origin YOUR_BRANCHNAME
```
Afterwards you can make a pull request, if you don't know how to do so we, of course, [have a guide here](docs/pull-requesting.md)
