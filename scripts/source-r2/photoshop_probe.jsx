#target photoshop
var report = new File('D:/OneDrive/桌面/文件/项目/sun-yingjie-portfolio/.sites-runtime/verified-url-checkout/private/sources/refinement-v2/photoshop-probe.txt');
report.encoding='UTF8';
report.open('w');
report.write('Photoshop '+app.version+'; documents '+app.documents.length);
report.close();
