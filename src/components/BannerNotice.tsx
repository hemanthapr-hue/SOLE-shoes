import { useState } from 'react';
import { Database, AlertCircle, Copy, Check, X, HelpCircle, FileCode, CheckCircle } from 'lucide-react';
import { API_URL, isUsingDemo } from '../config';

export default function BannerNotice() {
  const [isVisible, setIsVisible] = useState(true);
  const [showDocs, setShowDocs] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isVisible) return null;

  const isDemo = isUsingDemo();

  const googleAppsScriptCode = `// Google Apps Script Code.gs
// 1. Create a Google Sheet with 3 columns tabs:
//    - "Products" with header row: [id, title, brand, price, description, sizes, image_url, category]
//    - "Orders" with header row: [timestamp, name, email, phone, address, shoe_id, size, status]
//    - "AdminAuth" with header row: [username, password_hash]
// 2. Open Extensions -> Apps Script. Paste this code.
// 3. Click Deploy -> New Deployment. Select "Web App".
// 4. Set Execute as: "Me" and Who has access: "Anyone".
// 5. Deploy and copy the Web App URL. Paste it as API_URL in "/src/config.ts".

const DB_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;
  const sheetObj = SpreadsheetApp.openById(DB_ID);
  
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    if (action === "getProducts") {
      const sheet = sheetObj.getSheetByName("Products");
      const data = sheet.getDataRange().getValues();
      const products = [];
      const keys = data[0]; // Header values
      
      for (let i = 1; i < data.length; i++) {
        const item = {};
        for (let j = 0; j < keys.length; j++) {
          let val = data[i][j];
          if (keys[j] === "price") val = parseFloat(val) || 0;
          if (keys[j] === "sizes") val = val ? val.toString().split(",").map(s => s.trim()) : [];
          item[keys[j]] = val;
        }
        products.push(item);
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: products }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
        
    } else if (action === "getOrders") {
      const sheet = sheetObj.getSheetByName("Orders");
      const data = sheet.getDataRange().getValues();
      const orders = [];
      const keys = data[0];
      
      for (let i = 1; i < data.length; i++) {
        const item = {};
        for (let j = 0; j < keys.length; j++) {
          item[keys[j]] = data[i][j];
        }
        orders.push(item);
      }
      // Return sorted by timestamp desc
      orders.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: orders }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid action" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

function doPost(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    let postData;
    if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      postData = e.parameter;
    }
    
    const action = postData.action;
    const sheetObj = SpreadsheetApp.openById(DB_ID);
    
    if (action === "addOrder") {
      const sheet = sheetObj.getSheetByName("Orders");
      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        postData.name,
        postData.email,
        postData.phone,
        postData.address,
        postData.shoe_id,
        postData.size,
        "Pending"
      ];
      sheet.appendRow(row);
      return ContentService.createTextOutput(JSON.stringify({ success: true, timestamp: timestamp }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
        
    } else if (action === "addProduct") {
      const sheet = sheetObj.getSheetByName("Products");
      const sizesStr = Array.isArray(postData.sizes) ? postData.sizes.join(", ") : postData.sizes;
      const row = [
        postData.id || "prod_" + new Date().getTime(),
        postData.title,
        postData.brand,
        parseFloat(postData.price) || 0,
        postData.description,
        sizesStr,
        postData.image_url,
        postData.category
      ];
      sheet.appendRow(row);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
        
    } else if (action === "deleteProduct") {
      const sheet = sheetObj.getSheetByName("Products");
      const data = sheet.getDataRange().getValues();
      const targetId = postData.id;
      let deleted = false;
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === targetId) {
          sheet.deleteRow(i + 1);
          deleted = true;
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: deleted }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid Action" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

// Support preflight OPTIONS requests for CORS
function doOptions(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <>
      {/* Top Banner Notice */}
      <div 
        id="applet-banner-notice" 
        className={`w-full py-2.5 px-4 flex items-center justify-between text-xs transition duration-200 border-b ${
          isDemo 
            ? 'bg-amber-50/90 text-amber-900 border-amber-200' 
            : 'bg-emerald-50/90 text-emerald-900 border-emerald-200'
        }`}
      >
        <div className="flex items-center gap-2 max-w-[85%]">
          {isDemo ? (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" id="icon-warning" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" id="icon-success" />
          )}
          <span className="font-medium">
            {isDemo ? (
              <>
                <span className="font-bold">✨ High-Fidelity Demo Mode:</span> Showing local inventory, placing orders, and managing stock inside your local browser. Perfect for immediate preview in AI Studio!
              </>
            ) : (
              <>
                <span className="font-bold">🌐 Live Database Sync:</span> Successfully connected to Google Sheets backend (Apps Script Web App).
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDocs(true)}
            id="btn-connection-guide"
            className={`font-semibold underline uppercase tracking-wider text-[10px] hover:opacity-80 transition cursor-pointer flex items-center gap-1 shrink-0 ${
              isDemo ? 'text-amber-950' : 'text-emerald-950'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {isDemo ? 'Connect Google Sheets' : 'View Setup Guide'}
          </button>
          <button 
            onClick={() => setIsVisible(false)} 
            id="btn-dismiss-notice"
            className="hover:opacity-70 transition text-zinc-400 cursor-pointer"
            title="Dismiss Notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Connection Guide Sidebar / Backdrop Modal */}
      {showDocs && (
        <div 
          id="sheets-guide-modal" 
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-55 flex justify-end transition-opacity duration-300"
          onClick={() => setShowDocs(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white h-full shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
            id="sheets-modal-content"
          >
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-zinc-900" />
                  <div>
                    <h3 className="font-semibold text-lg text-zinc-900" id="guide-modal-title">Google Sheets Integration Guide</h3>
                    <p className="text-zinc-500 text-xs">Transform your applet from demo to real data in 3 minutes.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDocs(false)}
                  id="btn-close-guide"
                  className="p-1 rounded-full hover:bg-zinc-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-xs font-bold">1</span>
                    Step 1: Set Up Your Google Spreadsheet
                  </h4>
                  <p className="pl-7 mb-2 text-zinc-600">
                    Create a new Google Spreadsheet and create exactly three tabs labeled below (case-sensitive):
                  </p>
                  <ul className="pl-7 space-y-2.5">
                    <li className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/80">
                      <span className="font-bold text-zinc-900 block mb-1">📂 Products Tab</span>
                      <span className="text-zinc-500 font-mono text-xs block mb-1">Columns: id, title, brand, price, description, sizes, image_url, category</span>
                      <span className="text-[11px] text-zinc-400">Note: "sizes" is saved as a comma-separated list like "8, 9, 10".</span>
                    </li>
                    <li className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/80">
                      <span className="font-bold text-zinc-900 block mb-1">📂 Orders Tab</span>
                      <span className="text-zinc-500 font-mono text-xs block">Columns: timestamp, name, email, phone, address, shoe_id, size, status</span>
                    </li>
                    <li className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/80">
                      <span className="font-bold text-zinc-900 block mb-1">📂 AdminAuth Tab</span>
                      <span className="text-zinc-500 font-mono text-xs block">Columns: username, password_hash</span>
                      <span className="text-[11px] text-amber-600">Tip: Insert a default row with username <strong className="font-mono bg-amber-50 px-1 py-0.5 rounded">admin</strong> and password_hash <strong className="font-mono bg-amber-50 px-1 py-0.5 rounded">admin123</strong> to login easily!</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-xs font-bold">2</span>
                    Step 2: Copy and Paste Google Apps Script Code
                  </h4>
                  <p className="pl-7 text-zinc-600 mb-3">
                    In your spreadsheet, choose <strong>Extensions</strong> → <strong>Apps Script</strong>. Wipe out any code in the editor and replace it with the complete backend script:
                  </p>
                  <div className="pl-7">
                    <button
                      onClick={copyScriptToClipboard}
                      id="btn-copy-script"
                      className="py-2.5 px-4 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2"
                    >
                      {copiedScript ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          Copied Code Successfully!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Complete Code.gs Script
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-zinc-400 mt-1 cursor-default">
                      Keep the script ready to easily copy-paste. We've also created a copy inside <span className="font-mono bg-zinc-100 p-0.5 rounded">/Code.gs</span> in your workspace.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-xs font-bold">3</span>
                    Step 3: Deploy as a Public Web App
                  </h4>
                  <ol className="pl-7 space-y-1 list-decimal text-zinc-600">
                    <li>Inside Apps Script, click the blue <strong>Deploy</strong> button at the top right → <strong>New deployment</strong>.</li>
                    <li>Click the gear icon next to "Select type" and choose <strong>Web app</strong>.</li>
                    <li>Set description to "Shoe Business API".</li>
                    <li>Set <strong>Execute as:</strong> <strong className="text-zinc-900">Me (your-email)</strong>.</li>
                    <li>Set <strong>Who has access:</strong> <strong className="text-zinc-900">Anyone</strong>. (Crucial, so your web catalog works).</li>
                    <li>Click <strong>Deploy</strong>, authorize the Google permissions, and copy the <strong>Web App URL</strong>.</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-xs font-bold">4</span>
                    Step 4: Update config.ts with your URL
                  </h4>
                  <p className="pl-7 text-zinc-600">
                    Paste your copied URL as <code className="font-mono font-bold bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-900 text-xs">API_URL</code> in <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-900 text-xs text-nowrap">/src/config.ts</code> in the workspace. The applet will immediately switch from Demo Mode to live cloud updates!
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4 mt-6 text-right">
              <button
                onClick={() => setShowDocs(false)}
                id="btn-guide-close-bottom"
                className="py-2.5 px-6 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-medium text-zinc-700 transition cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
