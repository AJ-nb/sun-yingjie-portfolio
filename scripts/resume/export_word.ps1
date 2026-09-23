$ErrorActionPreference = 'Stop'
$resumeRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$resumePython = $env:PORTFOLIO_PYTHON
if (-not $resumePython) { $resumePython = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' }
if (-not (Test-Path -LiteralPath $resumePython)) { throw 'Set PORTFOLIO_PYTHON to the bundled Python runtime.' }
$build = Get-Content -LiteralPath (Join-Path $resumeRoot 'deliverables/resume/resume-build.json') -Raw | ConvertFrom-Json
$download = Join-Path $resumeRoot 'web/public/downloads'
New-Item -ItemType Directory -Path $download -Force | Out-Null
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    foreach ($entry in $build.variants) {
        $resumeDoc = Join-Path $resumeRoot $entry.docx
        $resumePdf = [IO.Path]::ChangeExtension($resumeDoc, '.pdf')
        $document = $null
        try {
            $document = $word.Documents.Open($resumeDoc, $false, $true, $false)
            $document.ExportAsFixedFormat($resumePdf, 17, $false, 0)
        } finally { if ($document) { $document.Close(0) } }
        $pages = & $resumePython -c "import sys;from pypdf import PdfReader;print(len(PdfReader(sys.argv[1]).pages))" $resumePdf
        if ($LASTEXITCODE -ne 0 -or [int]$pages -ne 1) { throw "Resume $($entry.id) must be one A4 page; found $pages. Reduce prose, not body font." }
        Copy-Item -LiteralPath $resumePdf -Destination (Join-Path $download ($entry.stem+'.pdf')) -Force
        Copy-Item -LiteralPath $resumeDoc -Destination (Join-Path $download ($entry.stem+'.docx')) -Force
    }
} finally { $word.Quit() }
& $resumePython (Join-Path $PSScriptRoot 'finalize_resumes.py')
if ($LASTEXITCODE -ne 0) { throw 'Resume finalization failed.' }
