import ExcelJS from 'exceljs';
import { EnquiryRecord, EnquiryStatus } from '../types';

export interface ExportFilterOptions {
  status?: string;
  plan?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

/**
 * Formats a Date string into a professional, consistent format:
 * e.g. "05 Sep 2026, 10:30 AM"
 */
export function formatExportDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const formattedHours = String(hours).padStart(2, '0');

    return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
  } catch {
    return dateString;
  }
}

/**
 * Formats phone numbers strictly as TEXT preserving +91 prefix:
 * e.g. "+91 8248744918"
 */
export function formatExportPhone(phone: string): string {
  if (!phone) return '—';
  const cleanDigits = phone.replace(/[^0-9]/g, '');
  if (cleanDigits.length === 10) {
    return `+91 ${cleanDigits}`;
  } else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
    return `+91 ${cleanDigits.substring(2)}`;
  } else if (phone.startsWith('+')) {
    return phone;
  }
  return `+91 ${cleanDigits}`;
}

/**
 * Cleans phone number for WhatsApp URLs
 */
export function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/**
 * Formats currency values cleanly ensuring UTF-8 symbol ₹ is preserved
 */
export function formatExportCurrency(value: string): string {
  if (!value) return '—';
  // Ensure ₹ symbol is clean and UTF-8 encoded
  return value.trim();
}

/**
 * Status visual configurations for Excel export
 */
const STATUS_EXCEL_STYLES: Record<
  string,
  { bg: string; fontColor: string; label: string }
> = {
  New: { bg: 'E6F4EA', fontColor: '137333', label: 'New Lead' },
  Contacted: { bg: 'E8F0FE', fontColor: '1A73E8', label: 'Contacted' },
  'Follow-up': { bg: 'FEF7E0', fontColor: 'B06000', label: 'Follow-up' },
  Converted: { bg: 'F3E8FD', fontColor: '7627BB', label: 'Converted' },
  Closed: { bg: 'F1F3F4', fontColor: '5F6368', label: 'Closed' },
};

/**
 * Generates and downloads a professionally styled Excel (.xlsx) file
 */
export async function exportEnquiriesToExcel(
  enquiries: EnquiryRecord[],
  reportSubtitle: string = 'All Enquiries'
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ELITE GROUP – SS CHIT FUNDS';
  workbook.lastModifiedBy = 'Elite Turf Admin';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Customer Enquiries', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 5 }], // Freeze top 5 header rows
    pageSetup: { orientation: 'landscape', fitToPage: true },
  });

  // Title Row 1: Brand Title
  worksheet.mergeCells('A1:K1');
  const titleRow1 = worksheet.getCell('A1');
  titleRow1.value = 'ELITE GROUP – SS CHIT FUNDS';
  titleRow1.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFC5A028' } };
  titleRow1.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF001A33' }, // Dark Navy
  };
  titleRow1.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 34;

  // Title Row 2: Subtitle
  worksheet.mergeCells('A2:K2');
  const titleRow2 = worksheet.getCell('A2');
  titleRow2.value = 'CUSTOMER ENQUIRY REPORT';
  titleRow2.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  titleRow2.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF001A33' },
  };
  titleRow2.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 24;

  // Title Row 3: Metadata (Generated Timestamp, Total Count, Filter)
  worksheet.mergeCells('A3:K3');
  const titleRow3 = worksheet.getCell('A3');
  const generatedDateStr = formatExportDateTime(new Date().toISOString());
  titleRow3.value = `Report Generated: ${generatedDateStr}   |   Total Enquiries: ${enquiries.length}   |   Filter: ${reportSubtitle}   |   CIN: U72900MH1995PLC095642`;
  titleRow3.font = { name: 'Arial', size: 9.5, italic: true, color: { argb: 'FFCBD5E1' } };
  titleRow3.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF00264D' }, // Medium Navy
  };
  titleRow3.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(3).height = 20;

  // Row 4: Spacing separator
  worksheet.getRow(4).height = 8;

  // Row 5: Column Headers
  const headers = [
    'Enquiry ID',
    'Date & Time',
    'Customer Name',
    'Mobile Number',
    'Interested Plan',
    'Preferred Plan',
    'Customer Message',
    'Status',
    'Admin Notes',
    'Primary WhatsApp',
    'Secondary WhatsApp',
  ];

  const headerRow = worksheet.getRow(5);
  headerRow.values = headers;
  headerRow.height = 30;

  // Style Header Row
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10.5, bold: true, color: { argb: 'FFC5A028' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF001226' }, // Imperial Dark Blue
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FFC5A028' } },
      bottom: { style: 'medium', color: { argb: 'FFC5A028' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      right: { style: 'thin', color: { argb: 'FF334155' } },
    };
  });

  // Populate Data Rows
  let currentRowIndex = 6;
  enquiries.forEach((enq, idx) => {
    const row = worksheet.getRow(currentRowIndex);
    const isEven = idx % 2 === 0;
    const rowBgColor = isEven ? 'FFFFFFFF' : 'FFF8FAFC'; // Soft zebra striping

    const formattedDate = formatExportDateTime(enq.createdAt);
    const formattedPhone = formatExportPhone(enq.mobileNumber);
    const cleanCustomerPhone = cleanPhoneForWhatsApp(enq.mobileNumber);

    // Primary & Secondary WhatsApp target links
    const primaryWaUrl = `https://wa.me/917338736352?text=${encodeURIComponent(
      `Enquiry ID: ${enq.id} | Customer: ${enq.fullName} (${enq.mobileNumber}) | Plan: ${enq.interestedPlan}`
    )}`;
    const secondaryWaUrl = `https://wa.me/919345836032?text=${encodeURIComponent(
      `Enquiry ID: ${enq.id} | Customer: ${enq.fullName} (${enq.mobileNumber}) | Plan: ${enq.interestedPlan}`
    )}`;

    // Set Cell Values
    row.getCell(1).value = enq.id;
    row.getCell(2).value = formattedDate;
    row.getCell(3).value = enq.fullName;
    row.getCell(4).value = formattedPhone; // Text format
    row.getCell(5).value = formatExportCurrency(enq.interestedPlan);
    row.getCell(6).value = formatExportCurrency(enq.preferredChitValue);
    row.getCell(7).value = enq.message ? enq.message.trim() : '—';
    row.getCell(8).value = enq.status;
    row.getCell(9).value = enq.adminNotes ? enq.adminNotes.trim() : '—';

    // Clickable WhatsApp Links
    row.getCell(10).value = {
      text: 'Message Line 1',
      hyperlink: primaryWaUrl,
      tooltip: 'Open WhatsApp chat for Primary Line (+91 7338736352)',
    };
    row.getCell(11).value = {
      text: 'Message Line 2',
      hyperlink: secondaryWaUrl,
      tooltip: 'Open WhatsApp chat for Secondary Line (+91 9345836032)',
    };

    // Row Height
    row.height = enq.message && enq.message.length > 50 ? 44 : 26;

    // Apply Styles to each data cell
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // Cell borders
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };

      // Base font
      cell.font = { name: 'Arial', size: 9.5, color: { argb: 'FF1E293B' } };

      // Base fill
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rowBgColor },
      };

      // Alignments & Specific column stylings
      switch (colNumber) {
        case 1: // Enquiry ID
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.font = { name: 'Consolas', size: 9, color: { argb: 'FF475569' } };
          break;
        case 2: // Date & Time
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          break;
        case 3: // Customer Name
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
          cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0F172A' } };
          break;
        case 4: // Mobile Number (Text format, never scientific notation)
          cell.numFmt = '@';
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
          break;
        case 5: // Interested Plan
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
          cell.font = { name: 'Arial', size: 9.5, color: { argb: 'FF0F172A' } };
          break;
        case 6: // Preferred Plan
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFB45309' } };
          break;
        case 7: // Customer Message
          cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
          break;
        case 8: { // Status (Color Coded Pill)
          const stStyle = STATUS_EXCEL_STYLES[enq.status] || STATUS_EXCEL_STYLES.New;
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF' + stStyle.fontColor } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF' + stStyle.bg },
          };
          break;
        }
        case 9: // Admin Notes
          cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
          cell.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF334155' } };
          break;
        case 10: // Primary WhatsApp
        case 11: // Secondary WhatsApp
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.font = { name: 'Arial', size: 9, bold: true, underline: true, color: { argb: 'FF0284C7' } };
          break;
      }
    });

    currentRowIndex++;
  });

  // Enable Auto-Filter on header row
  worksheet.autoFilter = {
    from: { row: 5, column: 1 },
    to: { row: Math.max(5, currentRowIndex - 1), column: 11 },
  };

  // Set explicit, readable column widths
  worksheet.columns = [
    { width: 22 }, // 1. Enquiry ID
    { width: 24 }, // 2. Date & Time
    { width: 24 }, // 3. Customer Name
    { width: 18 }, // 4. Mobile Number
    { width: 38 }, // 5. Interested Plan
    { width: 18 }, // 6. Preferred Plan
    { width: 44 }, // 7. Customer Message
    { width: 16 }, // 8. Status
    { width: 34 }, // 9. Admin Notes
    { width: 22 }, // 10. Primary WhatsApp
    { width: 22 }, // 11. Secondary WhatsApp
  ];

  // Write workbook to buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `SS_CHIT_FUNDS_Enquiries_${timestamp}.xlsx`;

  downloadBlob(blob, filename);
}

/**
 * Generates and downloads a clean, professional CSV file with UTF-8 BOM
 * and escaped text fields preventing scientific notation
 */
export function exportEnquiriesToCSV(
  enquiries: EnquiryRecord[],
  reportSubtitle: string = 'All Enquiries'
): void {
  const headers = [
    'Enquiry ID',
    'Date & Time',
    'Customer Name',
    'Mobile Number',
    'Interested Plan',
    'Preferred Plan',
    'Customer Message',
    'Status',
    'Admin Notes',
    'Primary WhatsApp',
    'Secondary WhatsApp',
  ];

  const rows = enquiries.map((enq) => {
    const formattedDate = formatExportDateTime(enq.createdAt);
    const formattedPhone = formatExportPhone(enq.mobileNumber);
    const primaryWaUrl = `https://wa.me/917338736352`;
    const secondaryWaUrl = `https://wa.me/919345836032`;

    return [
      `"${escapeCsv(enq.id)}"`,
      `"${escapeCsv(formattedDate)}"`,
      `"${escapeCsv(enq.fullName)}"`,
      `="${escapeCsv(formattedPhone)}"`, // Formula trick in CSV to force Excel to treat as text
      `"${escapeCsv(formatExportCurrency(enq.interestedPlan))}"`,
      `"${escapeCsv(formatExportCurrency(enq.preferredChitValue))}"`,
      `"${escapeCsv(enq.message || '—')}"`,
      `"${escapeCsv(enq.status)}"`,
      `"${escapeCsv(enq.adminNotes || '—')}"`,
      `"${escapeCsv(primaryWaUrl)}"`,
      `"${escapeCsv(secondaryWaUrl)}"`,
    ].join(',');
  });

  // Prepend UTF-8 BOM (\uFEFF) so Excel correctly recognizes Indian Rupee symbol (₹)
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `SS_CHIT_FUNDS_Enquiries_${timestamp}.csv`;

  downloadBlob(blob, filename);
}

/**
 * Escapes quotes for standard CSV compliance
 */
function escapeCsv(str: string): string {
  if (!str) return '';
  return str.replace(/"/g, '""');
}

/**
 * Helper to trigger file download in browser
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
