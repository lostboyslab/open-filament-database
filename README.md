# Open Filament Database by SimplyPrint
The Open Filament Database, facilitated by SimplyPrint.

## ✅ Contributing

### Prerequisites
- A GitHub account
- Git
- Python
- Node.js (v18 or higher, for the WebUI)
- npm or yarn package manager, for the WebUI

Please follow the instructions below to contribute new brands, materials, filaments and/or variants!

- You start by creating a fork of this repository and creating a new branch for your brand.
- You can then clone your new repository onto your computer and create a new branch using either the CLI or github desktop.
```bash
git clone https://github.com/YOUR_USERNAME/open-filament-database.git
cd open-filament-database
git switch YOUR_BRANCHNAME
```

### Modifying the database
You can now modify the database using either the WebUI or [the manual method](docs/manual.md), depending on your preference.

#### WebUI!
1. Enter the WebUI folder and install Dependencies
   ```bash
   cd open-filament-database/webui
   npm install
   ```

2. Start the Development Server
   ```bash
   npm run dev
   ```
    Navigate to the URL printed in the console, most of the time this will be [http://localhost:5173](http://localhost:5173).

### Submitting changes
After you've added your data you should run the data_validator like so to make sure your formatting and data is correct like so.

```bash
python data_validator.py --folder-names # Validates folder names.
python data_validator.py --json-files # Validates json files.
python data_validator.py --store-ids # Validates store ids.
```

If anything gets printed to the console you should fix it and rerun the command, when non occur you can push the changes to your remote repository using either github desktop or doing like so.

```bash
git add .
git commit -m "INSERT WHAT YOU DID"
git push –u origin YOUR_BRANCHNAME
``` 

When you've succesfully gotten your changes back into github you can make a PR on this repository with your changes.