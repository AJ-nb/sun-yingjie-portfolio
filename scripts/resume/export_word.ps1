$ErrorActionPreference = 'Stop'
$resumeRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$resumeDoc = Join-Path $resumeRoot 'deliverables/resume/sun-yingjie-resume.docx'
$resumePdf = Join-Path $resumeRoot 'deliverables/resume/sun-yingjie-resume.pdf'
$resumeDownload = Join-Path $resumeRoot 'web/public/downloads'
$resumePython = $env:PORTFOLIO_PYTHON
if (-not $resumePython) {
    $resumeBundledPython = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
    $resumePython = if (Test-Path -LiteralPath $resumeBundledPython) { $resumeBundledPython } else { (Get-Command python -ErrorAction Stop).Source }
}
& $resumePython -c "import pypdf" | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'The selected Python must have pypdf installed.' }
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $document = $word.Documents.Open($resumeDoc, $false, $true)
    $word.Options.Pagination = $false
    $document.ExportAsFixedFormat($resumePdf, 17)

    $document.Close(0)
} finally { $word.Quit() }
$pageCount = & $resumePython -c "import sys;from pypdf import PdfReader;print(len(PdfReader(sys.argv[1]).pages))" $resumePdf
if ($LASTEXITCODE -ne 0 -or [int]$pageCount -ne 1) { throw "Resume must be one page; export reports $pageCount" }
New-Item -ItemType Directory -Path $resumeDownload -Force | Out-Null
Copy-Item -LiteralPath $resumePdf -Destination (Join-Path $resumeDownload 'sun-yingjie-resume.pdf') -Force
Copy-Item -LiteralPath $resumeDoc -Destination (Join-Path $resumeDownload 'sun-yingjie-resume.docx') -Force
$manifest = [ordered]@{
    edition = 'resume-v5'
    profileSource = 'web/src/data/profile.json'
    contentSource = 'deliverables/resume/resume-content.json'
    pageCount = $pageCount
    renderer = 'Microsoft Word native fixed-format export'
    docxSha256 = (Get-FileHash -LiteralPath $resumeDoc -Algorithm SHA256).Hash.ToLowerInvariant()
    pdfSha256 = (Get-FileHash -LiteralPath $resumePdf -Algorithm SHA256).Hash.ToLowerInvariant()
    pdfBytes = (Get-Item -LiteralPath $resumePdf).Length
}
$manifest | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $resumeRoot 'deliverables/resume/resume-manifest.json') -Encoding utf8
Write-Output $resumePdf
