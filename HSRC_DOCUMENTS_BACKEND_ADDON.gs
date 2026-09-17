/*
 * ============================================================
 * HSRC DOCUMENTS MANAGER - BACKEND ADD-ON
 * Add this block to the SAME Google Apps Script project used
 * by the HSRC ID System backend.
 *
 * What it does:
 * - Creates/uses a Google Drive folder named "HSRC Documents"
 * - Lets admins add, edit/replace, and delete documents
 * - Lets the public portal read the published document list
 * - Uses the existing ADMIN_KEY for admin authorization
 *
 * Supported examples: PDF, Word, PowerPoint, Excel and common files.
 * Frontend currently limits uploads to 25 MB.
 * ============================================================
 */

const HSRC_DOCUMENTS_PROPERTY_KEY = "HSRC_DOCUMENTS_JSON";
const HSRC_DOCUMENTS_FOLDER_PROPERTY_KEY = "HSRC_DOCUMENTS_FOLDER_ID";
const HSRC_DOCUMENTS_MAX_BYTES = 25 * 1024 * 1024;

function getHSRCDocumentsStore_() {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(HSRC_DOCUMENTS_PROPERTY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveHSRCDocumentsStore_(documents) {
  PropertiesService.getScriptProperties()
    .setProperty(
      HSRC_DOCUMENTS_PROPERTY_KEY,
      JSON.stringify(documents || [])
    );
}

function getHSRCDocumentsFolder_() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty(HSRC_DOCUMENTS_FOLDER_PROPERTY_KEY);

  if (savedId) {
    try {
      return DriveApp.getFolderById(savedId);
    } catch (e) {}
  }

  const folders = DriveApp.getFoldersByName("HSRC Documents");
  const folder = folders.hasNext()
    ? folders.next()
    : DriveApp.createFolder("HSRC Documents");

  props.setProperty(
    HSRC_DOCUMENTS_FOLDER_PROPERTY_KEY,
    folder.getId()
  );

  return folder;
}

function hsrcDocumentExtension_(fileName) {
  const match = String(fileName || "").match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
}

function hsrcDocumentType_(type, fileName, mimeType) {
  const supplied = String(type || "").trim().toUpperCase();
  if (supplied) return supplied;

  const ext = hsrcDocumentExtension_(fileName);
  if (ext === "pdf") return "PDF";
  if (ext === "doc" || ext === "docx") return "WORD";
  if (ext === "ppt" || ext === "pptx") return "POWERPOINT";
  if (ext === "xls" || ext === "xlsx") return "EXCEL";

  const mime = String(mimeType || "").toLowerCase();
  if (mime.indexOf("pdf") >= 0) return "PDF";
  if (mime.indexOf("word") >= 0) return "WORD";
  if (mime.indexOf("presentation") >= 0) return "POWERPOINT";
  if (mime.indexOf("spreadsheet") >= 0) return "EXCEL";

  return "FILE";
}

function hsrcDocumentIcon_(type) {
  switch (String(type || "").toUpperCase()) {
    case "PDF":
      return { icon: "fa-file-pdf", iconClass: "bg-red-50 text-red-600" };
    case "WORD":
      return { icon: "fa-file-word", iconClass: "bg-blue-50 text-blue-600" };
    case "POWERPOINT":
      return { icon: "fa-file-powerpoint", iconClass: "bg-orange-50 text-orange-600" };
    case "EXCEL":
      return { icon: "fa-file-excel", iconClass: "bg-emerald-50 text-emerald-600" };
    default:
      return { icon: "fa-file-lines", iconClass: "bg-slate-50 text-slate-600" };
  }
}

function hsrcDocumentSize_(bytes) {
  const n = Number(bytes || 0);
  if (!n) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = n;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  const decimals = i === 0 ? 0 : value >= 10 ? 1 : 2;
  return value.toFixed(decimals) + " " + units[i];
}

function hsrcDocumentPublic_(doc) {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description || "",
    type: doc.type || "FILE",
    size: doc.size || "",
    icon: doc.icon || "fa-file-lines",
    iconClass: doc.iconClass || "bg-slate-50 text-slate-600",
    fileName: doc.fileName || "",
    url: doc.url || "",
    downloadUrl: doc.downloadUrl || doc.url || "",
    updatedAt: doc.updatedAt || ""
  };
}

function documentsListPublic_(req) {
  const docs = getHSRCDocumentsStore_();
  return json({
    ok: true,
    documents: docs.map(hsrcDocumentPublic_)
  });
}

function documentsAdminList_(req) {
  if (req.adminKey !== ADMIN_KEY) {
    return json({ ok: false, error: "Unauthorized" });
  }

  const docs = getHSRCDocumentsStore_();
  return json({
    ok: true,
    documents: docs.map(hsrcDocumentPublic_)
  });
}

function documentsAdminAdd_(req) {
  if (req.adminKey !== ADMIN_KEY) {
    return json({ ok: false, error: "Unauthorized" });
  }

  const p = req.payload || {};
  const title = String(p.title || "").trim();
  const fileName = String(p.fileName || "").trim();
  const mimeType = String(p.mimeType || "application/octet-stream").trim();
  const base64 = String(p.base64 || "").trim();

  if (!title) {
    return json({ ok: false, error: "Document title is required." });
  }
  if (!fileName || !base64) {
    return json({ ok: false, error: "A document file is required." });
  }

  const estimatedBytes = Math.floor(base64.length * 3 / 4);
  if (estimatedBytes > HSRC_DOCUMENTS_MAX_BYTES) {
    return json({ ok: false, error: "File is too large. Maximum is 25 MB." });
  }

  const folder = getHSRCDocumentsFolder_();
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64),
    mimeType,
    fileName
  );

  const file = folder.createFile(blob);

  try {
    file.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.VIEW
    );
  } catch (sharingError) {
    // The file can still be used if the Google Workspace domain
    // blocks public link sharing.
  }

  const type = hsrcDocumentType_(p.type, fileName, mimeType);
  const visual = hsrcDocumentIcon_(type);
  const now = new Date();

  const doc = {
    id: Utilities.getUuid(),
    title: title,
    description: String(p.description || "").trim(),
    type: type,
    size: hsrcDocumentSize_(file.getSize()),
    icon: visual.icon,
    iconClass: visual.iconClass,
    fileId: file.getId(),
    fileName: fileName,
    mimeType: mimeType,
    url: "https://drive.google.com/uc?export=download&id=" + file.getId(),
    downloadUrl: "https://drive.google.com/uc?export=download&id=" + file.getId(),
    updatedAt: Utilities.formatDate(now, Session.getScriptTimeZone(), "MMM d, yyyy h:mm a")
  };

  const docs = getHSRCDocumentsStore_();
  docs.push(doc);
  saveHSRCDocumentsStore_(docs);

  return json({
    ok: true,
    document: hsrcDocumentPublic_(doc)
  });
}

function documentsAdminUpdate_(req) {
  if (req.adminKey !== ADMIN_KEY) {
    return json({ ok: false, error: "Unauthorized" });
  }

  const p = req.payload || {};
  const id = String(p.id || "").trim();
  const docs = getHSRCDocumentsStore_();
  const index = docs.findIndex(d => String(d.id) === id);

  if (index < 0) {
    return json({ ok: false, error: "Document not found." });
  }

  const doc = docs[index];

  if (p.title !== undefined) {
    const title = String(p.title || "").trim();
    if (!title) return json({ ok: false, error: "Document title is required." });
    doc.title = title;
  }

  if (p.description !== undefined) {
    doc.description = String(p.description || "").trim();
  }

  const replacementBase64 = String(p.base64 || "").trim();
  const replacementFileName = String(p.fileName || "").trim();
  const replacementMime = String(p.mimeType || "").trim();

  if (replacementBase64) {
    const estimatedBytes = Math.floor(replacementBase64.length * 3 / 4);
    if (estimatedBytes > HSRC_DOCUMENTS_MAX_BYTES) {
      return json({ ok: false, error: "File is too large. Maximum is 25 MB." });
    }

    const folder = getHSRCDocumentsFolder_();
    const blob = Utilities.newBlob(
      Utilities.base64Decode(replacementBase64),
      replacementMime || "application/octet-stream",
      replacementFileName || doc.fileName || "document"
    );
    const newFile = folder.createFile(blob);

    try {
      newFile.setSharing(
        DriveApp.Access.ANYONE_WITH_LINK,
        DriveApp.Permission.VIEW
      );
    } catch (sharingError) {}

    try {
      if (doc.fileId) {
        DriveApp.getFileById(doc.fileId).setTrashed(true);
      }
    } catch (oldFileError) {}

    doc.fileId = newFile.getId();
    doc.fileName = replacementFileName || doc.fileName;
    doc.mimeType = replacementMime || doc.mimeType;
    doc.size = hsrcDocumentSize_(newFile.getSize());
    doc.type = hsrcDocumentType_(p.type, doc.fileName, doc.mimeType);

    const visual = hsrcDocumentIcon_(doc.type);
    doc.icon = visual.icon;
    doc.iconClass = visual.iconClass;
    doc.url = "https://drive.google.com/uc?export=download&id=" + newFile.getId();
    doc.downloadUrl = doc.url;
  } else if (p.type) {
    doc.type = hsrcDocumentType_(p.type, doc.fileName, doc.mimeType);
    const visual = hsrcDocumentIcon_(doc.type);
    doc.icon = visual.icon;
    doc.iconClass = visual.iconClass;
  }

  doc.updatedAt = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "MMM d, yyyy h:mm a"
  );

  saveHSRCDocumentsStore_(docs);

  return json({
    ok: true,
    document: hsrcDocumentPublic_(doc)
  });
}

function documentsAdminDelete_(req) {
  if (req.adminKey !== ADMIN_KEY) {
    return json({ ok: false, error: "Unauthorized" });
  }

  const p = req.payload || {};
  const id = String(p.id || "").trim();
  const docs = getHSRCDocumentsStore_();
  const index = docs.findIndex(d => String(d.id) === id);

  if (index < 0) {
    return json({ ok: false, error: "Document not found." });
  }

  const doc = docs[index];

  try {
    if (doc.fileId) {
      DriveApp.getFileById(doc.fileId).setTrashed(true);
    }
  } catch (e) {}

  docs.splice(index, 1);
  saveHSRCDocumentsStore_(docs);

  return json({ ok: true });
}


/*
 * ============================================================
 * IMPORTANT: Add these cases to your existing doPost switch:
 *
 * case "documents_admin_list":
 *   return documentsAdminList_(req);
 *
 * case "documents_admin_add":
 *   return documentsAdminAdd_(req);
 *
 * case "documents_admin_update":
 *   return documentsAdminUpdate_(req);
 *
 * case "documents_admin_delete":
 *   return documentsAdminDelete_(req);
 *
 * IMPORTANT: Add this case to your existing doGet switch:
 *
 * case "documents_list":
 *   return documentsListPublic_(e);
 *
 * ============================================================
 */
