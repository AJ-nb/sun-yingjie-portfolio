$ErrorActionPreference = 'Stop'
$resumeRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$resumeDoc = Join-Path $resumeRoot 'deliverables/resume/sun-yingjie-resume.docx'
$resumePdf = Join-Path $resumeRoot 'deliverables/resume/sun-yingjie-resume.pdf'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $document = $word.Documents.Open($resumeDoc, $false, $true)
    $document.ExportAsFixedFormat($resumePdf, 17)
    $document.Close(0)
} finally { $word.Quit() }
Write-Output $resumePdf
