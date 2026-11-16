# THEE onset Enterprise

A mobile-first personal and business finance tracker, designed as an installable Android Progressive Web App (PWA). It is inspired by the dashboard structure of the supplied reference app and includes:

- Net worth overview, monthly income/expense and cash flow
- Accounts (including M-Pesa, bank, cash and mobile wallets)
- Transaction ledger with M-Pesa/bank reference and business allocation fields
- Assets, debts and repayment due dates
- Projects with budget and spend tracking
- Investments, goals and spending budgets
- Monthly financial summaries and CSV export
- Automatic local-device saving, JSON backup/restore, offline app shell
- Optional Google Sheets cloud backup/sync using the included Apps Script

## 1. Preview locally

Open `index.html` in a browser for a quick preview. For PWA installation and service-worker/offline support, serve the folder over HTTPS (GitHub Pages works).

## 2. Publish with GitHub Pages

1. Create a new GitHub repository, for example `thee-onset-enterprise`.
2. Upload all files in this folder to the repository root (keep `index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `sw.js`, and `icon.svg` together).
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for the Pages deployment. Your app URL will look like `https://YOUR-USERNAME.github.io/thee-onset-enterprise/`.

## 3. Install on Android

1. Open the GitHub Pages URL in Chrome on your Android phone.
2. Tap Chrome's menu (⋮) and choose **Install app** or **Add to Home screen**.
3. Confirm. THEE onset Enterprise will appear on your home screen and open in its own app window.

The PWA is not a signed APK. It installs through Chrome and updates when the hosted files are updated. A Play Store APK would require a separate Android packaging/signing and release process.

## 4. Set up Google Sheets backend

1. Create a blank Google Sheet named **THEE onset Enterprise Backend**.
2. In that Sheet, choose **Extensions → Apps Script**.
3. Replace the starter code with the contents of `Code.gs`.
4. Change `API_KEY` at the top of `Code.gs` to a long private random string. Use the exact same key in the app.
5. Save the script. Run the `setup` function once from the Apps Script editor and approve the requested spreadsheet permissions. It creates tabs for Transactions, Accounts, Assets, Debts, Projects, Investments, Goals, Businesses, Settings and Sync Log.
6. Choose **Deploy → New deployment → Web app**.
7. Set **Execute as: Me**. Set access to **Anyone** (or the broadest access available in your Google Workspace that permits your phone's browser to reach it). Deploy and authorize.
8. Copy the Web app URL ending in `/exec`.
9. In THEE onset Enterprise, open **Settings & data**, paste the URL and the same private API key, then choose **Save connection**.
10. Choose **Sync now**. The app first checks whether cloud data exists; if not, it uploads the records currently on your device. If cloud data exists, it asks before replacing local records with the cloud copy.

**Security:** Anyone who obtains the deployed web-app URL and API key can access the spreadsheet data through the endpoint. Keep the key private, do not publish it in a public repository, and use a unique key. The app stores its key in browser local storage on your device. This is a personal record-keeping system, not a regulated banking platform. Never store PINs, passwords, card CVVs or online banking credentials here. Google Apps Script web apps may have account/workspace access restrictions; test the deployed endpoint before relying on it.

## 5. Backups and data

- Records save automatically to browser storage on the device where they are entered.
- Use **Settings & data → Download backup** regularly.
- Use **Restore backup** to load a previously exported JSON file.
- Google Sheets sync is an optional cloud copy. It is not a live bank feed and does not import M-Pesa statements automatically; record transactions manually using the transaction form and add the M-Pesa receipt/reference code.
- For true multi-device use, sync deliberately after changes. Avoid editing the same records on two devices at the same time because the cloud copy is a whole-dataset snapshot.

## Backend spreadsheet layout

The Apps Script creates these tabs. Collection tabs contain a row per record, with the full record preserved as JSON in the `Record JSON` column so new app fields remain compatible.

| Tab | Purpose |
|---|---|
| Transactions | Income, expense, transfer and savings ledger |
| Accounts | M-Pesa, bank, cash and wallet balances |
| Assets | Property, equipment and other owned assets |
| Debts | Lenders, outstanding balances, payment and due date |
| Projects | Budgets, expenditure and project status |
| Investments | Principal and current estimated value |
| Goals | Savings goals and spending budgets |
| Businesses | Business/entity names |
| Settings | Basic app settings (never stores API key) |
| Sync Log | Backend sync activity |
