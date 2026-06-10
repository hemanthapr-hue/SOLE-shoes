// Google Apps Script Code.gs
// This backend applet connects your frontend shoe catalog with Google Sheets.

const DB_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

/**
 * Handles incoming query requests.
 * Works with action=getProducts and action=getOrders
 */
function doGet(e) {
  const action = e.parameter.action;
  const sheetObj = SpreadsheetApp.openById(DB_ID);
  
  // Custom CORS response headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    if (action === "getProducts") {
      const sheet = sheetObj.getSheetByName("Products");
      if (!sheet) {
        return createJSONResponse({ success: false, error: "Products sheet tab not found. Please create a sheet tab named 'Products'" }, headers);
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createJSONResponse({ success: true, data: [] }, headers);
      }
      
      const products = [];
      const keys = data[0]; // Header values
      
      for (let i = 1; i < data.length; i++) {
        const item = {};
        for (let j = 0; j < keys.length; j++) {
          let val = data[i][j];
          if (keys[j] === "price") {
            val = parseFloat(val) || 0;
          } else if (keys[j] === "sizes") {
            val = val ? val.toString().split(",").map(s => s.trim()) : [];
          }
          item[keys[j]] = val;
        }
        products.push(item);
      }
      return createJSONResponse({ success: true, data: products }, headers);
        
    } else if (action === "getOrders") {
      const sheet = sheetObj.getSheetByName("Orders");
      if (!sheet) {
        return createJSONResponse({ success: false, error: "Orders sheet tab not found. Please create a sheet tab named 'Orders'" }, headers);
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createJSONResponse({ success: true, data: [] }, headers);
      }
      
      const orders = [];
      const keys = data[0];
      
      for (let i = 1; i < data.length; i++) {
        const item = {};
        for (let j = 0; j < keys.length; j++) {
          item[keys[j]] = data[i][j];
        }
        orders.push(item);
      }
      
      // Sort orders descending by timestamp
      orders.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      return createJSONResponse({ success: true, data: orders }, headers);
    }
    
    return createJSONResponse({ success: false, error: "Invalid Action parameters" }, headers);
      
  } catch(err) {
    return createJSONResponse({ success: false, error: err.message }, headers);
  }
}

/**
 * Handles incoming data writing requests.
 * Handles actions: 'addOrder', 'addProduct', and 'deleteProduct'
 */
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
      if (!sheet) {
        return createJSONResponse({ success: false, error: "Orders sheet tab not found." }, headers);
      }
      
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
      return createJSONResponse({ success: true, timestamp: timestamp }, headers);
        
    } else if (action === "addProduct") {
      const sheet = sheetObj.getSheetByName("Products");
      if (!sheet) {
        return createJSONResponse({ success: false, error: "Products sheet tab not found." }, headers);
      }
      
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
      return createJSONResponse({ success: true }, headers);
        
    } else if (action === "deleteProduct") {
      const sheet = sheetObj.getSheetByName("Products");
      if (!sheet) {
        return createJSONResponse({ success: false, error: "Products sheet tab not found." }, headers);
      }
      
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
      return createJSONResponse({ success: deleted }, headers);
    }
    
    return createJSONResponse({ success: false, error: "Method / Action not supported" }, headers);
      
  } catch(err) {
    return createJSONResponse({ success: false, error: err.toString() }, headers);
  }
}

/**
 * Handle standard cross-site preflight requests (CORS safety)
 */
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
}

// Utility function to format and send JSON
function createJSONResponse(dataObj, headers) {
  return ContentService.createTextOutput(JSON.stringify(dataObj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}
