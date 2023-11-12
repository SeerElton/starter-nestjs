import * as Excel from 'exceljs';

const getExcelDocument = async (file: string) => {

    const workbook = new Excel.Workbook();
    const content = await workbook.xlsx.readFile(file);
    return content;
}

export async function getExcelSheet(file: string, sheet: string) {
    const document = await getExcelDocument(file);
    const worksheet = document.worksheets.find(x => x.name == sheet)//[sheet];
    return worksheet;
}