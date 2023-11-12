import * as Excel from 'exceljs';
import * as path from 'path';
import { environment } from '../environment';

const getExcelDocument = async (file: string) => {
    const workbook = new Excel.Workbook();
    const content = await workbook.xlsx.readFile(file);
    return content;
}

export async function getMilestonesWorksheets() {
    const document = await getExcelDocument(environment.excelTemplates.milestones);
    return document.worksheets;
}

export async function getImmunizationWorksheets() {
    const document = await getExcelDocument(environment.excelTemplates.immunization);
    return document.worksheets[0];
}