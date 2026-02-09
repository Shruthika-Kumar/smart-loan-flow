import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Use Vite's asset handling to get the worker URL locally
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface OCRResult {
    success: boolean;
    rawText: string;
    confidence: number;
    parsedData: any;
    detectedType: string;
    error?: string;
}

// Parse Aadhaar card data
export const parseAadhaarCard = (text: string) => {
    const data: any = {
        documentType: 'Aadhaar',
        name: null,
        aadhaarNumber: null,
        dob: null,
        gender: null,
        address: null
    };

    const aadhaarMatch = text.match(/(\d{4}\s?\d{4}\s?\d{4})/);
    if (aadhaarMatch) data.aadhaarNumber = aadhaarMatch[1].replace(/\s/g, '');

    const dobMatch = text.match(/(?:DOB|Date of Birth)[:\s]*(\d{2}[/\-]\d{2}[/\-]\d{4})/i);
    if (dobMatch) data.dob = dobMatch[1];

    const genderMatch = text.match(/(?:Gender|Sex)[:\s]*(Male|Female|MALE|FEMALE)/i);
    if (genderMatch) {
        const g = genderMatch[1].toLowerCase();
        data.gender = g.charAt(0).toUpperCase() + g.slice(1);
    }

    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+?)(?:\s+No|\s+Aadhaar|\s+DOB|\s+Date|\d|\n|$)/i);
    if (nameMatch) data.name = nameMatch[1].trim();

    const addressMatch = text.match(/(?:Address)[:\s]*([\s\S]{10,200}?\d{6})/i);
    if (addressMatch) data.address = addressMatch[1].replace(/\n/g, ' ').trim();

    return data;
};

// Parse PAN card data
export const parsePANCard = (text: string) => {
    const data: any = {
        documentType: 'PAN',
        name: null,
        panNumber: null,
        dob: null,
        fatherName: null
    };

    const panMatch = text.match(/[A-Z]\s*[A-Z]\s*[A-Z]\s*[A-Z]\s*[A-Z]\s*\d\s*\d\s*\d\s*\d\s*[A-Z]/i);
    if (panMatch) data.panNumber = panMatch[0].replace(/\s/g, '').toUpperCase();

    const dobMatch = text.match(/(\d{2}[/\-]\d{2}[/\-]\d{4})/);
    if (dobMatch) data.dob = dobMatch[0];

    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+?)(?:\s+Father|\s+PAN|\s+DOB|\s+Date|\d|\n|$)/i);
    if (nameMatch) data.name = nameMatch[1].trim();

    const fatherMatch = text.match(/(?:Father's\s*Name|Father)[:\s]*([A-Z\s]{3,30})/i);
    if (fatherMatch) data.fatherName = fatherMatch[1].trim();

    return data;
};

// Parse Salary Slip
export const parseSalarySlip = (text: string) => {
    const data: any = {
        documentType: 'SalarySlip',
        employerName: null,
        monthYear: null,
        netPay: null,
        grossPay: null
    };

    // Inclusive salary regex - more aggressive for Net Pay
    const netPayMatch = text.match(/(?:Net|Monthly|Total|Take\s*Home|Takehome|Final|In-hand|In\s*Hand)\s*(?:Pay|Salary|Income|Amount|Payable|Deposit)[:\s]*₹?\s*([\d,]+\.?\d*)/i);
    if (netPayMatch) {
        data.netPay = netPayMatch[1].replace(/,/g, '');
    } else {
        // Fallback: look for generic "Total" near currency symbols
        const totalMatch = text.match(/(?:Total|Amount)[:\s]*₹?\s*([\d,]+\.\d{2})/i);
        if (totalMatch) data.netPay = totalMatch[1].replace(/,/g, '');
    }

    const grossPayMatch = text.match(/(?:Gross|Base|Basic|Earnings|Cost\s*to\s*Company|CTC)\s*(?:Pay|Salary|Income|Amount)[:\s]*₹?\s*([\d,]+\.?\d*)/i);
    if (grossPayMatch) data.grossPay = grossPayMatch[1].replace(/,/g, '');

    const monthYearMatch = text.match(/(?:\s|^)(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s-]*(20\d{2}|\d{2})(?:\s|$)/i);
    if (monthYearMatch) data.monthYear = `${monthYearMatch[1]} ${monthYearMatch[2]}`;

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    const employerKeywords = ['PVT', 'LTD', 'LIMITED', 'SERVICES', 'COMPANY', 'CORP', 'TECHNOLOGIES', 'SOLUTIONS', 'ORG', 'BANK', 'INC'];
    const employerMatch = lines.find(line => employerKeywords.some(key => line.toUpperCase().includes(key)));
    if (employerMatch) data.employerName = employerMatch;
    else if (lines.length > 0) data.employerName = lines[0];

    return data;
};

// Parse Bank Statement
export const parseBankStatement = (text: string) => {
    const data: any = {
        documentType: 'BankStatement',
        bankName: null,
        accountNumber: null,
        ifscCode: null,
        balance: null,
        accountHolderName: null
    };

    const banks = ['HDFC', 'SBI', 'ICICI', 'AXIS', 'KOTAK', 'YES', 'IDFC', 'UNION', 'CANARA', 'BOB', 'PNB', 'INDUSIND'];
    const bankFound = banks.find(bank => text.toUpperCase().includes(bank));
    if (bankFound) data.bankName = bankFound + (bankFound.length < 5 ? (bankFound === 'SBI' ? ' OF INDIA' : ' BANK') : '');

    const accountMatch = text.match(/(?:Account|A\/c|Acc|Number|No)[:.\s]*(\d{9,18})/i);
    if (accountMatch) data.accountNumber = accountMatch[1];

    const ifscMatch = text.match(/[A-Z]{4}0[A-Z0-9]{6}/i);
    if (ifscMatch) data.ifscCode = ifscMatch[0].toUpperCase();

    const balanceMatch = text.match(/(?:Balance|Bal|Available|Total|Amt)[:\s]*₹?\s*([\d,]+\.?\d*)/i);
    if (balanceMatch) data.balance = balanceMatch[1].replace(/,/g, '');

    const nameMatch = text.match(/(?:Holder|Name|Customer|Account\s*Holder)[:\s]*([A-Z\s]{3,40})/i);
    if (nameMatch) data.accountHolderName = nameMatch[1].trim();

    return data;
};

// Parse Form 16 / ITR
export const parseForm16 = (text: string) => {
    const data: any = {
        documentType: 'Form16',
        employerPAN: null,
        employeePAN: null,
        assessmentYear: null,
        totalIncome: null
    };

    const panMatches = text.matchAll(/[A-Z]{5}\d{4}[A-Z]/g);
    const pans = Array.from(panMatches).map(m => m[0]);
    if (pans.length >= 2) {
        data.employerPAN = pans[0];
        data.employeePAN = pans[1];
    } else if (pans.length === 1) {
        data.employeePAN = pans[0];
    }

    const ayMatch = text.match(/Assessment\s*Year\s*(\d{4}-\d{2,4})/i);
    if (ayMatch) data.assessmentYear = ayMatch[1];

    // More patterns for income in ITR/Form 16
    const incomeMatch = text.match(/(?:Total\s*Income|Income\s*Chargeable|Taxable\s*Income|Gross\s*Salary|Taxable\s*Salary)[:\s]*₹?\s*([\d,]+\.?\d*)/i);
    if (incomeMatch) data.totalIncome = incomeMatch[1].replace(/,/g, '');

    return data;
};

// Parse Address Proof
export const parseAddressProof = (text: string) => {
    const data: any = {
        documentType: 'AddressProof',
        customerName: null,
        address: null,
        pincode: null
    };

    const noise = ['BILL', 'INVOICE', 'PERIOD', 'STATEMENT', 'DATE', 'READING', ' UNITS', 'AMOUNT', 'PAYABLE', 'CONSUMED', 'UNITS', 'TOTAL', 'DUMMY', 'TEST', 'PROOF', 'GENERIC', 'NOT A REAL', 'GENERATED FOR'];
    const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 5 && !noise.some(n => l.toUpperCase().includes(n)));

    // Improved name detection
    const nameMatch = text.match(/(?:Name|Consumer|Customer|Holder)[:\s]*([A-Z\s]{3,40})/i);
    if (nameMatch) {
        data.customerName = nameMatch[1].trim();
    } else if (lines.length > 0) {
        data.customerName = lines[0];
    }

    const pinMatch = text.match(/(?:\s|^)(\d{6})(?:\s|$)/);
    if (pinMatch) data.pincode = pinMatch[1];

    // Address extraction: look for a block ending near the pincode or just a likely address block
    const addressMatch = text.match(/(?:Address)[:\s]*([\s\S]{10,200}?(?:\d{6}|INDIA|STATE))/i);
    if (addressMatch) {
        data.address = addressMatch[1].replace(/\n/g, ' ').trim();
    } else if (text.toUpperCase().includes('ADDRESS')) {
        const addressBlock = text.split(/ADDRESS/i)[1]?.slice(0, 200).replace(/\n/g, ' ').trim();
        if (addressBlock) data.address = addressBlock;
    } else {
        // Look for common address keywords in lines
        const addressKeywords = ['ROAD', 'STREET', 'FLAT', 'FLOOR', 'APARTMENT', 'COLONY', 'NAGAR', 'CITY', 'DISTRICT', 'HOUSE', 'SECTOR'];
        const addressLine = lines.find(line => addressKeywords.some(key => line.toUpperCase().includes(key)));
        if (addressLine) {
            data.address = lines.slice(lines.indexOf(addressLine), lines.indexOf(addressLine) + 3).join(', ');
        } else if (lines.length > 1) {
            // Fallback: take lines starting from index 1 (skipping name)
            data.address = lines.slice(0, 3).join(', ');
        }
    }

    return data;
};

// Image preprocessing
const preprocessCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Better grayscale conversion (Luminosity method: 0.299R + 0.587G + 0.114B)
    for (let i = 0; i < data.length; i += 4) {
        const grayscale = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = grayscale;
    }
    ctx.putImageData(imageData, 0, 0);
};

const imageToCanvas = (file: File): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) { reject(new Error('Could not get canvas context')); return; }
            ctx.drawImage(img, 0, 0);

            console.log(`[OCR] Image loaded: ${img.width}x${img.height}. Applying preprocessing...`);
            preprocessCanvas(canvas);

            resolve(canvas);
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
        img.src = url;
    });
};

const pdfToCanvas = async (file: File): Promise<HTMLCanvasElement> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    // Scale up for better OCR accuracy (3x scale)
    const viewport = page.getViewport({ scale: 3.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    console.log(`[OCR] PDF Page 1 rendered at 3x scale: ${canvas.width}x${canvas.height}`);

    if (!context) throw new Error('Could not get context');
    await page.render({ canvasContext: context, viewport: viewport, canvas: canvas } as any).promise;

    preprocessCanvas(canvas);
    return canvas;
};

export const performOCR = async (
    file: File,
    expectedType: string = 'auto',
    onProgress?: (progress: number) => void
): Promise<OCRResult> => {
    try {
        console.log(`[OCR] Starting process for ${file.name} (Type: ${file.type}, Target: ${expectedType})`);

        let input: HTMLCanvasElement;
        if (file.type === 'application/pdf') input = await pdfToCanvas(file);
        else input = await imageToCanvas(file);

        const result = await Tesseract.recognize(input, 'eng', {
            logger: (m) => {
                if (m.status === 'recognizing text' && onProgress) {
                    onProgress(Math.round(m.progress * 100));
                }
            },
        });

        const { text } = result.data;
        const confidence = Math.round(result.data.confidence);

        console.log(`[OCR] Extraction Complete. Confidence: ${confidence}%. Text length: ${text.length}`);
        if (text.length > 0) {
            console.log(`[OCR] Raw Text Preview: "${text.substring(0, 200).replace(/\n/g, ' ')}..."`);
        } else {
            console.warn("[OCR] No text was extracted from the document.");
        }

        let detectedType = expectedType;
        if (expectedType === 'auto') {
            const upText = text.toUpperCase();
            if (upText.includes('AADHAAR') || /\d{4}\s\d{4}\s\d{4}/.test(text)) detectedType = 'aadhaar';
            else if (upText.includes('INCOME TAX') || /[A-Z]{5}\d{4}[A-Z]/.test(upText)) detectedType = 'pan';
            else if (upText.includes('SALARY') || upText.includes('PAY SLIP')) detectedType = 'salary_slip';
            else if (upText.includes('FORM 16') || upText.includes('FORM NO. 16')) detectedType = 'form16';
            else if (upText.includes('ACCOUNT') || upText.includes('IFSC')) detectedType = 'bank_statement';
            else detectedType = 'address_proof';
        }

        let parsedData = {};
        switch (detectedType.toLowerCase()) {
            case 'aadhaar': parsedData = parseAadhaarCard(text); break;
            case 'pan': parsedData = parsePANCard(text); break;
            case 'salary_slip': parsedData = parseSalarySlip(text); break;
            case 'bank_statement':
            case 'bank': parsedData = parseBankStatement(text); break;
            case 'form16':
            case 'form16_itr': parsedData = parseForm16(text); break;
            case 'address_proof': parsedData = parseAddressProof(text); break;
            default: parsedData = { rawText: text };
        }

        return { success: true, rawText: text, confidence, parsedData, detectedType };
    } catch (error: any) {
        return { success: false, rawText: '', confidence: 0, parsedData: {}, detectedType: 'unknown', error: error.message };
    }
};
