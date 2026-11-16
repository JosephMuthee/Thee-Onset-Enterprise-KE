/** THEE onset Enterprise — Google Sheets backend
 * Bind this Apps Script project to your Google Sheet (Extensions > Apps Script).
 * Set API_KEY below to a long private random string before deployment.
 */
const API_KEY = 'CHANGE-THIS-TO-A-LONG-PRIVATE-KEY';
const COLLECTIONS = ['transactions','accounts','assets','debts','projects','investments','goals'];
const TAB_NAMES = {transactions:'Transactions',accounts:'Accounts',assets:'Assets',debts:'Debts',projects:'Projects',investments:'Investments',goals:'Goals'};
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.values(TAB_NAMES).forEach(name => ensureTab_(ss, name, ['Record ID','Record JSON','Updated At']));
  ensureTab_(ss, 'Businesses', ['Business Name']);
  ensureTab_(ss, 'Settings', ['Key','Value']);
  ensureTab_(ss, 'Sync Log', ['Timestamp','Action','Status']);
  return 'THEE onset backend is ready.';
}
function doGet(e) {
  return json_({ok:true,app:'THEE onset Enterprise',message:'Backend is online. Use the app to sync.'});
}
function doPost(e) {
  let action = 'unknown';
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    action = payload.action || 'save';
    if (!API_KEY || API_KEY.indexOf('CHANGE-THIS') === 0 || payload.key !== API_KEY) throw new Error('Invalid API key. Update API_KEY in Apps Script and the app settings.');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setup();
    if (action === 'load') {
      const data = readState_(ss);
      log_(ss, 'load', 'OK');
      return json_({ok:true,data:data});
    }
    if (action !== 'save' || !payload.data) throw new Error('Unsupported action or missing data.');
    writeState_(ss, payload.data);
    log_(ss, 'save', 'OK');
    return json_({ok:true,savedAt:new Date().toISOString()});
  } catch (err) {
    try { log_(SpreadsheetApp.getActiveSpreadsheet(), action, String(err)); } catch (_) {}
    return json_({ok:false,error:String(err.message || err)});
  }
}
function ensureTab_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  return sh;
}
function writeState_(ss, data) {
  COLLECTIONS.forEach(key => {
    const sh = ensureTab_(ss, TAB_NAMES[key], ['Record ID','Record JSON','Updated At']);
    sh.clearContents(); sh.appendRow(['Record ID','Record JSON','Updated At']);
    (data[key] || []).forEach(record => sh.appendRow([record.id || Utilities.getUuid(), JSON.stringify(record), record.updatedAt || new Date().toISOString()]));
  });
  const b = ensureTab_(ss, 'Businesses', ['Business Name']); b.clearContents(); b.appendRow(['Business Name']);
  (data.businesses || []).forEach(name => b.appendRow([name]));
  const s = ensureTab_(ss, 'Settings', ['Key','Value']); s.clearContents(); s.appendRow(['Key','Value']);
  const settings = data.settings || {};
  // Do not store the private API key in the spreadsheet.
  s.appendRow(['backendUrl', settings.backendUrl || '']);
}
function readState_(ss) {
  const data = {transactions:[],accounts:[],assets:[],debts:[],projects:[],investments:[],goals:[],businesses:[],settings:{backendUrl:'',apiKey:''}};
  COLLECTIONS.forEach(key => {
    const sh = ss.getSheetByName(TAB_NAMES[key]);
    if (!sh || sh.getLastRow() < 2) return;
    sh.getRange(2,2,sh.getLastRow()-1,1).getValues().forEach(row => { if (row[0]) { try { data[key].push(JSON.parse(row[0])); } catch (_) {} } });
  });
  const b = ss.getSheetByName('Businesses');
  if (b && b.getLastRow() > 1) data.businesses = b.getRange(2,1,b.getLastRow()-1,1).getValues().flat().filter(String);
  return data;
}
function log_(ss, action, status) {
  const sh = ensureTab_(ss, 'Sync Log', ['Timestamp','Action','Status']);
  sh.appendRow([new Date(), action, status]);
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
