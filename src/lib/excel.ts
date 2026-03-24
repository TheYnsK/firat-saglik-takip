import ExcelJS from "exceljs";

type CellValue = string | number | boolean | null;

type ExportColumn = {
    header: string;
    key: string;
    width: number;
};

type ExportRow = Record<string, CellValue>;

export async function createStyledExcelBuffer(params: {
    sheetName: string;
    reportTitle: string;
    columns: ExportColumn[];
    rows: ExportRow[];
}) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Fırat Sağlık Takip";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(params.sheetName, {
        pageSetup: {
            paperSize: 9, // A4
            orientation: "portrait",
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            margins: {
                left: 0.35,
                right: 0.35,
                top: 0.5,
                bottom: 0.5,
                header: 0.2,
                footer: 0.2,
            },
        },
        properties: {
            defaultRowHeight: 22,
        },
        views: [{ state: "frozen", ySplit: 3 }],
    });

    worksheet.columns = params.columns.map((col) => ({
        header: col.header,
        key: col.key,
        width: col.width,
    }));

    const totalColumns = params.columns.length;
    const lastColumnLetter = worksheet.getColumn(totalColumns).letter;

    worksheet.mergeCells(`A1:${lastColumnLetter}1`);
    const titleCell = worksheet.getCell("A1");
    titleCell.value = params.reportTitle;
    titleCell.font = {
        bold: true,
        size: 14,
        color: { argb: "FF1E293B" },
    };
    titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
    };
    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0F2FE" },
    };
    worksheet.getRow(1).height = 26;

    worksheet.mergeCells(`A2:${lastColumnLetter}2`);
    const infoCell = worksheet.getCell("A2");
    infoCell.value = `Oluşturulma Tarihi: ${new Date().toLocaleString("tr-TR")}`;
    infoCell.font = {
        italic: true,
        size: 10,
        color: { argb: "FF64748B" },
    };
    infoCell.alignment = {
        horizontal: "right",
        vertical: "middle",
    };

    const headerRow = worksheet.getRow(3);
    params.columns.forEach((col, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = col.header;
        cell.font = {
            bold: true,
            color: { argb: "FF0F172A" },
        };
        cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2E8F0" },
        };
        cell.border = {
            top: { style: "thin", color: { argb: "FFCBD5E1" } },
            bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
            left: { style: "thin", color: { argb: "FFCBD5E1" } },
            right: { style: "thin", color: { argb: "FFCBD5E1" } },
        };
    });
    headerRow.height = 24;

    params.rows.forEach((rowData) => {
        const row = worksheet.addRow(rowData);
        row.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
        };

        row.eachCell((cell) => {
            cell.font = {
                size: 10,
                color: { argb: "FF334155" },
            };
            cell.border = {
                bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
            };
        });
    });

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 4) {
            row.height = 22;
        }
    });

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return arrayBuffer;
}

export function createExcelResponse(params: {
    buffer: ArrayBuffer;
    filename: string;
}) {
    const blob = new Blob([params.buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return new Response(blob, {
        status: 200,
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${params.filename}"`,
        },
    });
}