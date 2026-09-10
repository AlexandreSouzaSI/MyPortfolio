// Gera o PDF do currículo automaticamente a partir dos mesmos dados usados
// nas abas "Experiência"/"Formação" do site (lib/resume.ts) e dos dados
// pessoais (lib/site-config.ts) — sem precisar subir nenhum PDF manual.
//
// Roda antes de cada build ("prebuild" no package.json), então o CV
// disponível pra download sempre reflete o conteúdo atual do portfólio.
// Pra atualizar o CV: edite lib/resume.ts ou lib/site-config.ts e rode de
// novo (build/deploy já faz isso sozinho).
//
// Layout: banner escuro no topo (nome/cargo/contato), corpo em uma coluna
// com seções bem espaçadas, uma barrinha colorida "linha do tempo" ao lado
// de cada experiência/formação, e as habilidades como "pills" — um
// currículo com cara de template profissional, não de formulário simples.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import PDFDocument from 'pdfkit';
import { siteConfig } from '../lib/site-config';
import { experience, education, certifications, topSkills } from '../lib/resume';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COLORS = {
    headerBg: '#1e1b4b', // indigo-950
    headerStripe: '#818cf8', // indigo-400
    headerText: '#ffffff',
    headerAccent: '#c7d2fe', // indigo-200 (cargo)
    headerSubtle: '#a5b4fc', // indigo-300 (contato)
    accent: '#4338ca', // indigo-700 (títulos de seção, bullets)
    dark: '#18181b', // zinc-900 (texto principal)
    gray: '#52525b', // zinc-600 (texto secundário)
    lightLine: '#e4e4e7', // zinc-200 (divisórias)
    timeline: '#c7d2fe', // indigo-200 (barrinha de experiência/formação)
    pillBg: '#eef2ff', // indigo-50
    pillText: '#4338ca', // indigo-700
};

function sectionHeading(doc: PDFKit.PDFDocument, title: string) {
    doc.moveDown(1.4);
    doc
        .fillColor(COLORS.accent)
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(title.toUpperCase(), { characterSpacing: 0.6 });
    const y = doc.y + 4;
    doc
        .moveTo(doc.page.margins.left, y)
        .lineTo(doc.page.width - doc.page.margins.right, y)
        .strokeColor(COLORS.lightLine)
        .lineWidth(1)
        .stroke();
    doc.moveDown(1);
}

/** Desenha as habilidades como "pills" (tag arredondada), quebrando linha
 * automaticamente quando não cabe mais na largura disponível. Retorna o Y
 * imediatamente abaixo da última linha de pills. */
function drawSkillPills(doc: PDFKit.PDFDocument, skills: string[], x0: number, y0: number, maxWidth: number): number {
    const paddingX = 10;
    const paddingY = 6;
    const gapX = 8;
    const gapY = 10;
    const fontSize = 9.5;
    const rowHeight = fontSize + paddingY * 2;

    doc.font('Helvetica').fontSize(fontSize);

    let x = x0;
    let y = y0;

    const bottomLimit = doc.page.height - doc.page.margins.bottom;

    skills.forEach((skill) => {
        const textWidth = doc.widthOfString(skill);
        const pillWidth = textWidth + paddingX * 2;

        if (x !== x0 && x + pillWidth > x0 + maxWidth) {
            x = x0;
            y += rowHeight + gapY;
        }

        // Checagem manual de limite de página: como este loop desenha
        // retângulos/texto em coordenadas absolutas (não usa o fluxo
        // automático do pdfkit), precisa decidir sozinho quando quebrar de
        // página — senão as pills continuariam sendo desenhadas fora da
        // folha visível.
        if (y + rowHeight > bottomLimit) {
            doc.addPage();
            x = x0;
            y = doc.page.margins.top;
        }

        doc.roundedRect(x, y, pillWidth, rowHeight, rowHeight / 2).fill(COLORS.pillBg);
        doc
            .fillColor(COLORS.pillText)
            .font('Helvetica-Bold')
            .fontSize(fontSize)
            .text(skill, x + paddingX, y + paddingY - 0.5, { lineBreak: false });

        x += pillWidth + gapX;
    });

    return y + rowHeight;
}

async function main() {
    const outputDir = path.resolve(__dirname, '../public/cv');
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'alexandre-moura-de-souza.pdf');

    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 50, left: 56, right: 56 },
        info: {
            Title: `Currículo — ${siteConfig.fullName}`,
            Author: siteConfig.fullName,
        },
    });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const marginLeft = doc.page.margins.left;
    const marginRight = doc.page.margins.right;
    const contentWidth = pageWidth - marginLeft - marginRight;

    // ---- Espaço reservado pra foto (círculo no canto superior direito do
    // banner). Se existir um arquivo public/cv/photo.jpg|jpeg|png, ele é
    // usado (recortado em círculo); senão fica só o espaço reservado. ----
    const photoSize = 86;
    const photoGap = 22;
    const photoX = pageWidth - marginRight - photoSize;
    const photoTopOffset = 30;
    const photoCx = photoX + photoSize / 2;
    const photoCy = photoTopOffset + photoSize / 2;
    const photoRadius = photoSize / 2;
    const headerTextWidth = contentWidth - photoSize - photoGap;

    const photoPath = ['jpg', 'jpeg', 'png']
        .map((ext) => path.resolve(__dirname, `../public/cv/photo.${ext}`))
        .find((p) => fs.existsSync(p));

    // ---- Banner do topo (nome, cargo, contato) ----
    const contactLine1 = [siteConfig.email, siteConfig.phone, siteConfig.github.replace('https://', '')].join(
        '   ·   ',
    );
    const contactLine2 = siteConfig.linkedin.replace('https://', '');

    doc.font('Helvetica-Bold').fontSize(24);
    const nameHeight = doc.heightOfString(siteConfig.fullName, { width: headerTextWidth });
    doc.font('Helvetica-Bold').fontSize(11.5);
    const roleHeight = doc.heightOfString(siteConfig.role, { width: headerTextWidth });
    doc.font('Helvetica').fontSize(9.5);
    const contactHeight1 = doc.heightOfString(contactLine1, { width: headerTextWidth });
    const contactHeight2 = doc.heightOfString(contactLine2, { width: headerTextWidth });

    const stripeHeight = 5;
    const topPad = 34;
    const textBlockHeight =
        nameHeight + 12 + roleHeight + 15 + contactHeight1 + 5 + contactHeight2;
    const bandHeight = Math.max(
        stripeHeight + topPad + textBlockHeight + 32,
        stripeHeight + photoTopOffset + photoSize + 26,
    );

    doc.rect(0, 0, pageWidth, stripeHeight).fill(COLORS.headerStripe);
    doc.rect(0, stripeHeight, pageWidth, bandHeight - stripeHeight).fill(COLORS.headerBg);

    // Foto (real, se existir) ou espaço reservado com contorno tracejado
    if (photoPath) {
        doc.save();
        doc.circle(photoCx, photoCy, photoRadius).clip();
        doc.image(photoPath, photoX, photoTopOffset, { width: photoSize, height: photoSize });
        doc.restore();
        doc.circle(photoCx, photoCy, photoRadius).lineWidth(2.5).strokeColor(COLORS.headerStripe).stroke();
    } else {
        doc.circle(photoCx, photoCy, photoRadius).lineWidth(1).fillColor('#2e2a6b').fill();
        doc.dash(3, { space: 3 });
        doc.circle(photoCx, photoCy, photoRadius).lineWidth(1.2).strokeColor(COLORS.headerAccent).stroke();
        doc.undash();
    }

    let cursorY = stripeHeight + topPad;
    doc
        .fillColor(COLORS.headerText)
        .font('Helvetica-Bold')
        .fontSize(24)
        .text(siteConfig.fullName, marginLeft, cursorY, { width: headerTextWidth });
    cursorY += nameHeight + 12;
    doc
        .fillColor(COLORS.headerAccent)
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text(siteConfig.role, marginLeft, cursorY, { width: headerTextWidth });
    cursorY += roleHeight + 15;
    doc
        .fillColor(COLORS.headerSubtle)
        .font('Helvetica')
        .fontSize(9.5)
        .text(contactLine1, marginLeft, cursorY, { width: headerTextWidth });
    cursorY += contactHeight1 + 5;
    doc
        .fillColor(COLORS.headerSubtle)
        .font('Helvetica')
        .fontSize(9.5)
        .text(contactLine2, marginLeft, cursorY, { width: headerTextWidth });

    doc.x = marginLeft;
    doc.y = bandHeight + 30;

    // ---- Resumo ----
    sectionHeading(doc, 'Resumo');
    doc
        .fillColor(COLORS.dark)
        .font('Helvetica')
        .fontSize(10.5)
        .text(siteConfig.pitch, { width: contentWidth, lineGap: 2.5 });

    // ---- Experiência (com barrinha de destaque à esquerda) ----
    sectionHeading(doc, 'Experiência');
    experience.forEach((exp, i) => {
        const startY = doc.y;
        doc
            .fillColor(COLORS.dark)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text(exp.role, { width: contentWidth, continued: true });
        doc.fillColor(COLORS.gray).font('Helvetica').text(`  —  ${exp.company}`);
        doc
            .fillColor(COLORS.gray)
            .font('Helvetica-Oblique')
            .fontSize(9.5)
            .text(`${exp.period}   ·   ${exp.location}`, { width: contentWidth });
        doc.moveDown(0.45);
        doc
            .fillColor(COLORS.dark)
            .font('Helvetica')
            .fontSize(10)
            .text(exp.description, { width: contentWidth, lineGap: 2.5 });
        const endY = doc.y;
        doc.rect(marginLeft - 14, startY + 2, 3, Math.max(endY - startY - 6, 0)).fill(COLORS.timeline);
        if (i < experience.length - 1) doc.moveDown(1.5);
    });

    // ---- Formação (mesmo estilo de barrinha) ----
    sectionHeading(doc, 'Formação');
    education.forEach((ed, i) => {
        const startY = doc.y;
        doc
            .fillColor(COLORS.dark)
            .font('Helvetica-Bold')
            .fontSize(10.5)
            .text(ed.degree, { width: contentWidth });
        doc
            .fillColor(COLORS.gray)
            .font('Helvetica')
            .fontSize(9.5)
            .text(`${ed.institution}   ·   ${ed.period}`, { width: contentWidth });
        const endY = doc.y;
        doc.rect(marginLeft - 14, startY + 2, 3, Math.max(endY - startY - 4, 0)).fill(COLORS.timeline);
        if (i < education.length - 1) doc.moveDown(1.2);
    });

    // ---- Certificações (bolinha desenhada, não caractere de fonte — "●"
    // via texto não é suportado pelo encoding padrão das fontes do pdfkit
    // e rendeia como "%X" quebrado, por isso desenhamos um círculo real) ----
    sectionHeading(doc, 'Certificações');
    const dotRadius = 2.2;
    const certIndent = dotRadius * 2 + 9;
    doc.font('Helvetica').fontSize(10);
    certifications.forEach((cert) => {
        // Lê doc.y "ao vivo" a cada item (em vez de carregar um Y calculado
        // manualmente entre iterações) — se o pdfkit quebrar de página
        // sozinho aqui dentro, doc.y já reflete a posição correta na nova
        // página, então o próximo item nunca herda uma posição inválida.
        const startY = doc.y;
        doc.circle(marginLeft + dotRadius, startY + 5, dotRadius).fill(COLORS.accent);
        doc
            .fillColor(COLORS.dark)
            .font('Helvetica')
            .fontSize(10)
            .text(cert, marginLeft + certIndent, startY, { width: contentWidth - certIndent });
        doc.x = marginLeft;
        doc.y += 11;
    });

    // ---- Principais habilidades (pills) ----
    sectionHeading(doc, 'Principais habilidades');
    const pillsBottomY = drawSkillPills(doc, topSkills, marginLeft, doc.y, contentWidth);
    doc.y = pillsBottomY;

    doc.end();

    await new Promise<void>((resolve, reject) => {
        stream.on('finish', () => resolve());
        stream.on('error', reject);
    });

    console.log(`CV gerado em ${outputPath}`);
}

main().catch((error) => {
    console.error('Falha ao gerar o CV:', error);
    process.exit(1);
});
